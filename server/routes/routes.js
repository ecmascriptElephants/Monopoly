module.exports = (app, express) => {
  app.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    console.log('should be in here');
  })
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), (req, res) => res.redirect('/'))
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
  }
}
