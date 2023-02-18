const { Fragment } = require('../../../model/fragment')
const { createErrorResponse, createSuccessResponse } = require('../../../response')
const logger = require('../../../logger')

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    // Extract the 'expand' parameter from the query string
    const expand = Number(req.query.expand) || 0

    // Validate the 'expand' parameter
    if (![0, 1].includes(expand)) {
      return res.status(400).json(createErrorResponse({
        status: 'error',
        code: 400,
        message: 'Invalid value for `expand` parameter. Only `1` or `0` is allowed.'
      }))
    }

    // Extract the ownerId from the authenticated user in the request
    const ownerId = req.user

    // Log the appropriate message based on the 'expand' parameter
    logger.info(expand === 1 ? 'Fragments expanded' : 'Only fragment identifiers will be shown')

    // Query the database for the fragments owned by the user with the specified 'expand' value
    const fragments = await Fragment.byUser(ownerId, expand === 1)

    // Return the response with the list of fragments in a success JSON payload
    return res.status(200).json(createSuccessResponse({ fragments }))
  } catch (err) {
    // Handle any unexpected errors
    logger.error(err)
    return res.status(500).json(createErrorResponse({
      status: 'error',
      code: 500,
      message: 'Can not fetch fragments'
    }))
  }
}
