const userController = require('../controllers/userController')

module.exports = (app, express, passport) => {
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signup'
  }), (req, res) => res.redirect('/board'))

  // app.post('/login', (req, res, next) => {
  //   console.log('log in a user',req.body)
  // })

  app.post('/login', (req, res, done) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) return done(err)
      if (!user) return res.redirect('/')
      req.login(user, () => {
        return res.redirect('/board')
      })
    })(req, res, done)
  })

  app.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    console.log('should be in here')
  })
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/board',
    failureRedirect: '/login'
  }), (req, res) => res.redirect('/'))

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/board', (req, res) => {
    console.log('here')
    res.redirect('/#/board')
  })

  app.get('/', (req, res) => {
    res.redirect('/#/')
  })

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
  }
}
