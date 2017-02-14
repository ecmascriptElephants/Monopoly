const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes/routes.js')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../config/fb')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

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
      // const photo = `https://graph.facebook.com/${profile.username}/picture?width=200&height=200&access_token=${accessToken}`
      // profile.photo = photo
      console.log('fb profile id', profile.id)
      return done(null, profile)
    })
  }
))
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token')
  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../index')))
app.use(express.static(path.join(__dirname, '../src')))
routes(app, express, passport)

app.listen(port, () => {
  console.log('Listening on port ', port)
})

module.exports = app
