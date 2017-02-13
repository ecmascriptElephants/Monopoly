const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
// const routes = ('./routes/routes.js')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../config/config')

const app = express()
const port = process.env.PORT || 8000

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))
passport.use(new FacebookStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      // check if user exists in our db
      console.log('fb profile id', profile.id);
      return done(null, profile);
    })
  }
))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../index')))
app.use(express.static(path.join(__dirname, '../src')))
// routes(app, express)

app.listen(port, () => {
  console.log('Listening on port ', port)
})

module.exports = app
