const markdownIt = require('markdown-it')
const md = new markdownIt()

module.exports.convert = (type, buffer) => {
  if (type === 'text/html')
    return md.render(buffer.toString('utf8'))
  else
    return buffer
}
