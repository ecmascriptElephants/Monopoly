const userController = require('../controllers/userController')

module.exports = (app, express, passport, io) => {
  app.post('/api/login', userController.login)
  app.post('/api/signup', userController.signup)
  app.get('/auth/facebook', passport.authenticate('facebook'))
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    authType: 'rerequest',
    failureRedirect: '/login'
  }), (req, res) => {
    passport.user = req.user
    res.redirect('/lobby')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/lobby', (req, res) => {
    res.redirect('/#/lobby')
  })
  app.get('/user', (req, res) => {
    res.send(passport.user)
  })
  // const ensureAuthenticated = (req, res, next) => {
  //   if (req.isAuthenticated()) return next()
  //   res.redirect('/login')
  // }
}
