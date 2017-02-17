var game = {}
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
      console.log(data)
      data.socketID = socket.id
      socket.join(data.gameID)
      game[data.gameID].push(data)
      io.in(data.gameID).emit('player joined')
    })

    socket.on('start', () => {
      socket.emit('redirect')
    })

    socket.on('load', (data) => {
      socket.emit('users', {players: game[data.gameID]})
    })
  })
}

// function joinGame (data) {
//   if (socket.manager.rooms['/' + data.gameID]) {

//   }

// }
