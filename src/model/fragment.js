// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto')
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type')

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data')

class Fragment {

  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type)
      throw new Error(`ownerId and type are required`)

    if (typeof size !== 'number')
      throw new Error(`size should be number`)

    if (size < 0)
      throw new Error(`size cannot be negative`)

    if (!Fragment.isSupportedType(type))
      throw new Error(`type ${type} is not supported`)


    this.id = id || randomUUID()
    this.ownerId = ownerId
    this.created = created || new Date().toISOString()
    this.updated = updated || new Date().toISOString()
    this.type = type
    this.size = size
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    let result
    try {
      result = await listFragments(ownerId, expand)
    } catch (error) {
      throw new Error(`Can not list fragment`)
    }
    return result
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    let fragment
    try {
      fragment = await readFragment(ownerId, id)
    } catch (error) {
      throw new Error(`Can not read fragment`)
    }

    if (!fragment)
      throw new Error(`No fragment found`)

    return Promise.resolve(fragment)
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id)
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString()
    return writeFragment(this)
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return Promise.resolve(readFragmentData(this.ownerId, this.id))
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data)
      throw new Error(`Buffer is not given`)

    try {
      await writeFragmentData(this.ownerId, this.id, data)
      this.updated = new Date().toISOString()
      this.size = data.length
      this.save()
    } catch (error) {
      throw new Error(`Can not write fragment`)
    }
    return Promise.resolve()
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type)
    return type
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/')
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case "text/plain":
        return ["text/plain"]
      case "text/markdown":
        return ["text/plain", "text/markdown", "text/html"]
      case "text/html":
        return ["text/html", "text/plain"]
      case "application/json":
        return ["application/json", "text/plain"]
      case "image/png":
        return ["image/png", "image/jpeg", "image/webp", "image/gif"]
      case "image/jpeg":
        return ["image/png", "image/jpeg", "image/webp", "image/gif"]
      case "image/webp":
        return ["image/png", "image/jpeg", "image/webp", "image/gif"]
      case "image/gif":
        return ["image/png", "image/jpeg", "image/webp", "image/gif"]
      default:
        return []
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value)
    switch (type) {
      case 'text/plain':
        return true
      case 'text/markdown':
        return true
      case 'text/html':
        return true
      case 'application/json':
        return true
      case 'image/png':
        return true
      case 'image/jpeg':
        return true
      case 'image/webp':
        return true
      case 'image/gif':
        return true
      default:
        return false
    }
  }
}

module.exports.Fragment = Fragment
