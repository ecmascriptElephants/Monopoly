var game = {i: 0}
module.exports = (io) => {
  let user = 0
  let userStorage = []
  io.on('connection', function (socket) {
    socket.on('user joined', (data) => {
      userStorage.push(data)
      user++
    })
    socket.on('new game', (data) => {
      var gameID = 1
      socket.broadcast.emit('new game', { gameID, socketID: socket.id })
      game[gameID] = [data]
      socket.join(gameID.toString())
    })

    socket.on('join', (data) => {
      data.socketID = socket.id
      socket.join(data.gameID)
      game[data.gameID].push(data)
      io.in(data.gameID).emit('player joined', data)
    })

    socket.on('start', () => {
      socket.emit('redirect')
    })

    socket.on('load', (data) => {
      io.emit('users', {players: game[data.gameID]})
      socket.emit('firstPlayer')
    })

    socket.on('endTurn', () => {

    })
  })
}
