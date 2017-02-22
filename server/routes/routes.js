const token = require('../jwt/jwt')
module.exports = (app, express, passport) => {
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/',
    failureFlash: true
  }),
    (req, res) => {
      res.send({ token: passport.token, user: passport.user })
    })

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '#/'
  }),
    (req, res) => {
      res.send({ token: passport.token, user: passport.user })
    })

  app.get('/auth/facebook', passport.authenticate('facebook'))

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    authType: 'rerequest',
    failureRedirect: '/login'
  }), (req, res) => {
    passport.user = req.user
    passport.token = token.tokenGenerator(req.user.id)
    res.redirect('/#/auth')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/', (req, res) => {
    console.log('here')
    res.redirect('/#/')
  })

  app.get('/auth', (req, res) => {
    res.redirect('/#/auth')
  })
  app.get('/get-info', (req, res) => {
    res.send({ token: passport.token, user: passport.user })
  })

  app.get('/lobby', (req, res) => {
    res.redirect('#/lobby')
  })
  app.get('/login', (req, res) => {
    res.redirect('/#/')
  })
  app.get('/signup', (req, res) => {
    res.redirect('/#/signup')
  })
  app.get('/user', (req, res) => {
    res.send(passport.user)
  })
}
