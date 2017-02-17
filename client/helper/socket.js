import io from 'socket.io-client'
const socket = io.connect('/')

module.exports = {
  socket,
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
