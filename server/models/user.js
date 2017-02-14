const db = require('./db')
const User = {}

User.findByUsername = (username, cb) => {
  return db.raw('select * from users;')
    .then((user) => {
      console.log('user', user)
      return cb(user)
    })
    .catch((err) => { console.error(err) })
}

User.addUser = (username, password) => {
  return db('users').insert({username: username, password: password})
    .then(function (username) {
      console.log('user ' + username + ' has added to the db!')
    })
    .catch(function (err) {
      console.error(err)
    })
}


module.exports = User
