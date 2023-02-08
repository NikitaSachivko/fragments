// const { Fragment } = require('../../../model/fragment')
// const { createErrorResponse, createSuccessResponse } = require('../../../response')
// const logger = require('../../../logger')

// module.exports = async (req, res) => {
//   const ownerId = req.headers.authorization.split(' ')[1]
//   const id = req.params.id.split('.')[0]

//   try {
//     const fragment = await Fragment.byId(ownerId, id)

//     if (!fragment.formats.includes(req.headers['content-type'])) {
//       logger.error(`Cannot change existing type`)
//       throw new Error(`Cannot change existing type`)

//     } else {

//       const textPlain = req.body.toString('utf8')
//       const formats = fragment.formats
//       await fragment.setData(textPlain)
//       logger.info(`data buffer was changed`)
//       res.status(200).json(createSuccessResponse({
//         fragment: {
//           id: fragment.id,
//           created: fragment.created,
//           updated: fragment.updated,
//           ownerId: fragment.ownerId,
//           type: fragment.type,
//           size: fragment.size,
//           formats: formats
//         }
//       }))
//     }

//   } catch (error) {
//     logger.error(error)
//     res.status(404).json(createErrorResponse({ code: 404, message: error }))
//   }
// }
