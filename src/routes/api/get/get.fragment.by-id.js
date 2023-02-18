const { Fragment } = require('../../../model/fragment')
const { createErrorResponse } = require('../../../response')
const logger = require('../../../logger')
const extensionToContentType = require('../../../helper-functions/extension-to-content-type')

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {

  const ownerId = req.user

  // Get the fragment id and extension from the URL parameters
  // If extension is not present, default to an empty string
  const [id, extension = ''] = req.params.id.split('.')

  // Get the content type based on the extension
  const type = extensionToContentType(extension)

  // Check if the content type is supported
  if (!Fragment.isSupportedType(type)) {

    // Log a warning if the content type is not supported
    logger.warn(`Unsupported Content-Type: "${extension}"`)

    // Return a 404 response with a custom error message
    res.status(415).json(createErrorResponse(415, `Unsupported Content-Type: "${extension}"`))

    return
  }

  try {
    // Get the fragment by its id and owner id
    const fragment = await Fragment.byId(ownerId, id)

    // Get the data of the fragment
    const buffer = await fragment.getData()

    // Convert the buffer to a string in utf8 encoding
    // Fix XSS issue
    const textPlain = escape(buffer.toString('utf8'))

    res.setHeader('Content-Type', type)
    res.status(200).send(textPlain)

  } catch (error) {
    logger.error(`Error getting fragment with id "${id}": ${error}`)
    res.status(400).json(createErrorResponse(400, `No fragment with id = ${id}`))

    return
  }
}
