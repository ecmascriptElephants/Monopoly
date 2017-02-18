import io from 'socket.io-client'
const socket = io.connect('/')

module.exports = {
  socket,
  init: (data) => {
    socket.emit('load', data)
  },
  userJoined: (userInfo) => {
    socket.emit('user joined', userInfo)
  },
  newGame: (data) => {
    socket.emit('new game', data)
  },
  join: (data) => {
    socket.emit('join', data)
  },
  start: (data) => {
    socket.emit('start', data)
  },
  end: (data) => {
    socket.emit('endTurn', data)
  },
  updatePos: (data) => {
    socket.emit('dice rolled', data)
  }
}
