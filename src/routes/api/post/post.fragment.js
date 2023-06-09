const { Fragment } = require("../../../model/fragment")
const { createErrorResponse, createSuccessResponse } = require("../../../response")
const logger = require("../../../logger")

module.exports = async (req, res) => {
  const contentType = req.headers["content-type"]

  // Check if the "Content-Type" is supported by the Fragment model
  if (!Fragment.isSupportedType(contentType)) {
    logger.error("Unsupported Content-Type: %s", contentType)

    // Return a 415 "Unsupported Media Type" error response
    res
      .status(415)
      .json(
        createErrorResponse(415, "Unsupported Content-Type",)
      )
    return
  }

  const ownerId = req.user
  let fragment

  try {
    fragment = new Fragment({
      ownerId,
      type: contentType,
      size: Number(req.headers["content-length"]),
    })
    await fragment.save()
    logger.info("Fragment saved: %s", fragment.id)
  } catch (err) {
    logger.error(`Can not create new fragment: ${err}`)

    res
      .status(500)
      .json(
        createErrorResponse(500, `Can not create new fragment`,)
      )
    return
  }

  try {
    await fragment.setData(req.body)
    logger.info("Buffer was set for fragment: %s", fragment.id)
  } catch (err) {
    logger.warn("Buffer was not set for fragment: %s", fragment.id)
  }

  // Set the "Location" header with the URL of the fragment
  res.setHeader(
    "Location",
    `http://${process.env.API_URL || req.headers.host}/v1/fragments/${fragment.id}`
  )
  res.status(201).json(createSuccessResponse({ fragment }))
}


