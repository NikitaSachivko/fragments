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

      output = convert(type, buffer)

      fragment.type = type
      fragment.size = output.length

      await fragment.setData(output)

      fragment.save()
    }

    // Convert the buffer to a string in utf8 encoding
    // Fix XSS issue
    const textPlain = req.sanitize(output.toString('utf8'))

    res.setHeader('Content-Type', type)
    res.status(200).send(textPlain)

  } catch (error) {
    logger.error(`Error getting fragment with id "${id}": ${error}`)
    res.status(404).json(createErrorResponse(404, `Error getting fragment with id "${id}": ${error}`))

    return
  }
}
