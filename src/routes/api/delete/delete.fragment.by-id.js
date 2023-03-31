const { Fragment } = require('../../../model/fragment')
const { createSuccessResponse, createErrorResponse } = require('../../../response')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  const ownerId = req.user

  const id = req.params.id

  try {

    if (!(await Fragment.byUser(ownerId, 0)).includes(id))
      throw "The Fragment doesn't exist"

    Fragment.delete(ownerId, id)

    res.status(200).json(createSuccessResponse())

  } catch (error) {
    logger.error(`Error deleting fragment with id "${id}": ${error}`)
    res.status(400).json(createErrorResponse(404, `Error deleting fragment with id "${id}"`))
  }
}
