const { Fragment } = require('../../../model/fragment')
const { createErrorResponse } = require('../../../response')
const logger = require('../../../logger')
const path = require('path')
const mime = require('mime-types')
const { convert } = require('../../../fragmentConverter')

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const ownerId = req.user

  // Get the fragment id and extension from the URL parameters
  // If extension is not present, default to an empty string
  const { name: id, ext: extension } = path.parse(req.params.id)


  try {
    // Get the fragment by its id and owner id
    const fragment = await Fragment.byId(ownerId, id)

    // Get the data of the fragment
    const buffer = await fragment.getData()

    const formats = fragment.formats

    // Get the content type based on the extension
    const type = mime.lookup(extension) || fragment.type

    let output = buffer

    // If type is the same with fragment type, then we don't need to convert
    if (fragment.type !== type) {
      if (!formats.includes(type)) {
        logger.warn(`Type ${fragment.type} can not be converted to: "${extension}"`)

        res.status(415).json(createErrorResponse(415, `Type ${fragment.type} can not be converted to: "${extension}"`))

        return
      }

      // Converting fragment content according to type
      output = await convert(fragment.type, type, buffer)
    }

    // Convert the buffer to a string in utf8 encoding
    const convertedData = type.includes("image") ? output : req.sanitize(output.toString('utf8'))

    res.setHeader('Content-Length', convertedData.length)
    res.setHeader('Content-Type', type)
    res.status(200).send(convertedData)

  } catch (error) {
    logger.error(`Error getting fragment with id "${id}": ${error}`)
    res.status(404).json(createErrorResponse(404, `Error getting fragment with id "${id}": ${error}`))

    return
  }
}
