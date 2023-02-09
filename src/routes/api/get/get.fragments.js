// Our module for creating responses
// const { Fragment } = require('../../../model/fragment')
// const { createErrorResponse, createSuccessResponse } = require('../../../response')
// const logger = require('../../../logger')
const { createSuccessResponse } = require('../../../response')
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // const expand = Number(req.query.expand) || 0

  // if (expand != 1 && expand != 0) {
  //   res.status(400).json(createErrorResponse(
  //     { status: 'error', code: 400, message: 'Wrong `expand` parameter, only 1 or 0 is possible' }
  //   ))
  // } else {

  //   const ownerId = req.headers.authorization.split(' ')[1]

  //   if (expand == 1)
  //     logger.info("Fragments expanded")
  //   else
  //     logger.info("Only the fragment identifiers will be shown")

  //   const fragments = await Fragment.byUser(ownerId, expand == 1)
  //   res.status(200).json(createSuccessResponse({ fragments: fragments }))
  // }

  res.status(200).json(createSuccessResponse({ fragments: [] }))
}
