const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const routes = require('./routes/routes.js')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../config/fb')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const db = require('./models/db')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(cors())

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
      db.raw(`SELECT  * FROM fb_user where fbID = ${Number(profile.id)}`)
        .then((result) => {
          if (result[0].length === 0) {
            db.raw(`INSERT INTO fb_user VALUES (null, ${Number(profile.id)}, '${profile.displayName}')`)
              .then(() => {
                return done(null, profile)
              })
          } else {
            return done(null, profile)
          }
        })
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
        if (result[0].length === 0) {
          User.addUser(username, password)
            .then(() => {
              return done(null, username)
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
    User.findByUsername(username, (result) => {
      if (result[0].length === 0) {
        console.log('User not found!')
        // return done(null, false, req.flash('loginMessage', 'User not found.'))
      } else {
        if (password !== result[0].password) {
          console.log('wrong password')
          // return done(null, false, req.flash('loginMessage', 'Incorrect password.'))
        } else {
          console.log('user found')
          // return done(null, result)
        }
      }
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
        if (result.length === 0) {
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
      if (result.length === 0) {
        console.log('User not found!')
      } else {

      }
    })
  }
))

app.use(passport.initialize())
app.use(passport.session())

app.use(session({
  secret: 'ecmascriptElephant',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../index')))
app.use(express.static(path.join(__dirname, '../src')))

routes(app, express, passport, io)

server.listen(port)

module.exports = app
