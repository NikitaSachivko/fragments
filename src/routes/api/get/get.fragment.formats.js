const { Fragment } = require('../../../model/fragment')
const { createSuccessResponse, createErrorResponse } = require('../../../response')
const logger = require('../../../logger')

module.exports = async (req, res) => {

  const ownerId = req.user

  const id = req.params.id

  try {
    // Get the fragment by its id and owner id
    const fragment = await Fragment.byId(ownerId, id)
    const formats = fragment.formats

    res.status(200).json(createSuccessResponse({ formats }))

  } catch (error) {
    logger.error(`Error getting formats for fragment with id "${id}": ${error}`)
    res.status(404).json(createErrorResponse(404, `Error getting formats for fragment with id = ${id}`))
  }
}
