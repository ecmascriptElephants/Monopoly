const User = require('../models/user')

module.exports = {
  signup: (req, res, next) => {
    passport.authenticate('local-signup', {
      successRedirect: '/lobby',
      failureRedirect: '/signup'
    })
  },

  login: (req, res, next) => {
    passport.authenticate('local-login', {
      successRedirect: '/lobby',
      failureRedirect: '/login'
    })
  }

}
