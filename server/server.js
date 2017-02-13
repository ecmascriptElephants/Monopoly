const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes/routes.js')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const config = require('../config/config')

const User = require('./models/user')

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost:3306',
    user: 'root',
    database: 'monopoly'
  }
})

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
      console.log('fb profile id', profile.id)
      return done(null, profile);
    })
  }
))

passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
  },
  (req, username, password, done) => {
    process.nextTick(() => {
      // find a user in the db with given username
      User.findByUsername(username, (result) => {
        if(result.length === 0) {
          User.addUser(username, password)
        } else {
          console.log('user exited')
        }
      })
    })
  }
))

passport.use('local-login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
(req, username, password, done) => {
  User.findByUsername(username, (result) => {
  if(result.length === 0) {
    console.log('User not found!')
  } else {
    
  }
})
}
))

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../index')))
app.use(express.static(path.join(__dirname, '../src')))
routes(app, express, passport)

app.listen(port, () => {
  console.log('Listening on port ', port)
})

module.exports = app
