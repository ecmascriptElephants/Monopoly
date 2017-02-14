const userController = require('../controllers/userController')

module.exports = (app, express, passport) => {

  // app.post('/login', userController.login(passport))
  // app.post('/signup', (req, res, next) => {
  //   console.log('sign up a user',req.body)
  //   passport.authenticate('local-signup',
  // })

  app.post('/signup',passport.authenticate('local-signup'))


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
    res.redirect('/#/board')
  })
  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
  }
}
