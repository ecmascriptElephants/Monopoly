import io from 'socket.io-client'
const socket = io.connect('/')

module.exports = {
  socket,
  userJoined: function (userInfo) {
    socket.emit('user joined', userInfo)
  },
  newGame: function () {
    socket.emit('new game')
  },
  join: function (gameID) {
    socket.emit('join', {gameID})
  }
}
