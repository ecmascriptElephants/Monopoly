const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt-nodejs')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes/routes.js')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../config/fb')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const User = require('./models/user')
const db = require('./models/db')
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
      db.raw(`SELECT  * FROM fb_user where fbID = ${Number(profile.id)}`)
      .then((result) => {
        // console.log('show result', result)
        if (result[0].length === 0) {
          db.raw(`INSERT INTO fb_user VALUES (null, ${Number(profile.id)}, '${profile.displayName}')`)
          .then(() => {
            return done(null, profile)
          })
        } else {
          console.log('profile', profile)
          return done(null, profile)
        }
      })
      console.log('fb profile id', profile.id)
    })
  }
))

passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  (req, username, password, done) => {
    console.log('here!! username and pass ', username, password)
    process.nextTick(() => {
      // find a user in the db with given username
      User.findByUsername(username, (result) => {
        console.log('result', result)
        if (result[0].length === 0) {
          console.log('can register')
          bcrypt.genSalt(5, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => {
              User.addUser(username, hash)
              .then(() => {
                return done(null, username)
              })
            })
          })
        } else {
          console.log('user existed')
          // return done(null, false, req.flash('signupMessage', 'User exited.'));
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
    // console.log('log in user', username, password)
    User.findByUsername(username, (result) => {
      if (result[0].length === 0) {
        console.log('User not found!')
        return done(null, false, req.flash('loginMessage', 'User not found.'))
      } else {
        result = JSON.parse(JSON.stringify(result[0]))
        bcrypt.compare(password, result[0].password, (err, resp) => {
          if (err) console.error(err)
          if (resp) {
            console.log('user found, log in success')
            console.log('user', result[0])
            return done(null, result[0])
          } else {
            console.log('wrong password')
            // return done(null, false, req.flash('loginMessage', 'Incorrect password.'))
          }
        })
      }
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
app.use(session({
  secret: 'ecmascriptElephant',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../index')))
app.use(express.static(path.join(__dirname, '../src')))
routes(app, express, passport)

app.listen(port, () => {
  console.log('Listening on port ', port)
})

module.exports = app
