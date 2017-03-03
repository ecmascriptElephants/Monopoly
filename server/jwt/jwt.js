var jwt = require('jsonwebtoken')

module.exports = {
  tokenGenerator: (user) => {
    const payload = {
      id: user
    }
    return jwt.sign(payload, 'ecmascriptElephant')
  },

  verifyToken: (token) => {
    console.log('in jwt.js verifyToken has been invoked! jwt.verify(token, "secret" = ', jwt.verify(token, 'ecmascriptElephant'))
    return jwt.verify(token, 'ecmascriptElephant')
  }
}
