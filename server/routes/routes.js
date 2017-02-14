module.exports = (app, express, passport) => {
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
