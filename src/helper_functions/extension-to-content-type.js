// Function to convert file extension to content type
const extensionToContentType = (extension) => {

  // Use a switch statement to match the extension to the corresponding content type
  switch (extension) {
    case "html":
      return "text/html"
    case "txt":
      return "text/plain"
    case "md":
      return "text/markdown"
    case "json":
      return "application/json"
    case "png":
      return "image/png"
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "webp":
      return "image/webp"
    case "gif":
      return "image/gif"
    case "": // Empty extension counted as text/plain
      return "text/plain"
    default:
      return "Not supported extension"
  }
}

module.exports = extensionToContentType
