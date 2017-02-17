import io from 'socket.io-client'
const socket = io.connect('/')

module.exports = {
  socket,
  init: function (data) {
    console.log('init in socket')
    socket.emit('load', data)
  },
  userJoined: function (userInfo) {
    socket.emit('user joined', userInfo)
  },
  newGame: function (data) {
    socket.emit('new game', data)
  },
  join: function (data) {
    socket.emit('join', data)
  },
  start: function () {
    socket.emit('start')
  }
}
