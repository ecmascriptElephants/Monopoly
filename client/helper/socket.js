import io from 'socket.io-client'
const socket = io.connect('/')

module.exports = {
  socket,
  init: (data) => {
    console.log('init in socket')
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
  start: () => {
    socket.emit('start')
  },
  end: (data) => {
    socket.emit('endTurn', data)
  }
}
