const userController = require('../controllers/userController')

module.exports = (app, express, passport) => {
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signup'
  }), (req, res) => res.redirect('/lobby'))

  // app.post('/login', (req, res, next) => {
  //   console.log('log in a user',req.body)
  // })

  app.post('/login', (req, res, done) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) return done(err)
      if (!user) return res.redirect('/')
      req.login(user, () => {
        return res.redirect('/lobby')
      })
    })(req, res, done)
  })

  app.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    console.log('should be in here')
  })

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

  app.get('/', (req, res) => {
    res.redirect('/#/')
  })

  // const ensureAuthenticated = (req, res, next) => {
  //   if (req.isAuthenticated()) return next()
  //   res.redirect('/login')
  // }

  app.get('/lobby', (req, res) => {
    res.redirect('/#/lobby')
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
