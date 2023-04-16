const { Fragment } = require('../../../model/fragment')
const { createErrorResponse, createSuccessResponse } = require('../../../response')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  const ownerId = req.user

  const id = req.params.id

  try {
    const fragment = await Fragment.byId(ownerId, id)
    if (!fragment.formats.includes(req.headers['content-type'])) {
      logger.error(`Cannot change existing type`)
      throw new Error(`Cannot change existing type`)

    } else {

      let buffer

      const formats = fragment.formats

      if (fragment.type.includes("image")) {
        buffer = req.body
      } else {
        buffer = req.body.toString('utf8')
      }

      await fragment.setData(buffer)

      logger.info(`data buffer was changed`)
      res.status(200).json(createSuccessResponse({
        fragment: {
          id: fragment.id,
          created: fragment.created,
          updated: fragment.updated,
          ownerId: fragment.ownerId,
          type: fragment.type,
          size: fragment.size,
          formats: formats
        }
      }))
    }

  } catch (error) {
    logger.error(error)
    res.status(404).json(createErrorResponse(404, error.message))
  }
}
