const crypto = require('crypto')

const hashEmail = (email) => {
  const hash = crypto.createHash('sha256')
  hash.update(email)
  return hash.digest('hex')
}

module.exports = hashEmail
