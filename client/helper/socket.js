import io from 'socket.io-client'
const socket = io.connect('/', [
  true
])

module.exports = {
  socket,
  init: (data) => {
    socket.emit('load', data)
  },
  refresh: (data) => {
    socket.emit('refresh', data)
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
  },
  sendChat: (data) => {
    socket.emit('send chat', data)
  },
  updateProps: (data) => {
    console.log(data.properties)
    socket.emit('property update', data)
  },
  updateMoney: (data) => {
    socket.emit('money update', data)
  },
  loadGame: (gameID) => {
    socket.emit('load game', gameID)
  },
  comment: (gameID, string) => {
    socket.emit(gameID, 'comment', string)
  }
}
