const { Fragment } = require('../../../model/fragment')
const { createSuccessResponse, createErrorResponse } = require('../../../response')
const logger = require('../../../logger')

module.exports = async (req, res) => {

  const ownerId = req.user

  const id = req.params.id

  try {
    // Get the fragment by its id and owner id
    const fragment = await Fragment.byId(ownerId, id)

    res.status(200).json(createSuccessResponse({ fragment }))

  } catch (error) {
    logger.error(`Error getting fragment with id "${id}": ${error}`)
    res.status(400).json(createErrorResponse(400, `No fragment with id = ${id}`))
  }
}
