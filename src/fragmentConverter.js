const markdownIt = require('markdown-it')
const { marked } = require('marked')
const { htmlToText } = require('html-to-text')

const md = new markdownIt()
const sharp = require('sharp')


module.exports.convert = async (baseType, convertToType, buffer) => {
  if (baseType === "text/markdown") {
    const markdownString = buffer.toString('utf8')

    if (convertToType === "text/plain") {
      return marked(markdownString).replace(/<\/?[^>]+(>|$)/g, "")

    } else if (convertToType === "text/html") {
      return marked(markdownString)
    }

  } else if (baseType === 'text/html') {
    const htmlString = buffer.toString('utf8')

    if (convertToType === "text/markdown") {
      return md.render(buffer.toString('utf8'))

    }
    else if (convertToType === "text/plain") {

      return htmlToText(htmlString, {
        wordwrap: 130
      })
    }
  }
  else if (baseType === 'application/json') {
    const jsonString = buffer.toString('utf8')

    if (convertToType === "text/plain") {
      return JSON.stringify(JSON.parse(jsonString), null, 2)

    }
  }
  else if (baseType.includes('image')) {
    const newType = convertToType.replace("image/", "")
    return await sharp(buffer)
      .toFormat(newType)
      .toBuffer()
      .then(result => result)
      .catch(err => err)
  }
  else
    return buffer
}
