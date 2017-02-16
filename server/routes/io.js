
module.exports = (io) => {
  let user = 0
  let userStorage = []
  io.on('connection', function (socket) {
    socket.on('user joined', (data) => {
      userStorage.push(data)
      user++
    })
    socket.on('new game', () => {
      var gameID = 1
      io.sockets.emit('new game', { gameID, socketID: socket.id })
      socket.join(gameID.toString())
    })

    socket.on('join', (data) => {
      data.socketID = socket.id
      socket.join(data.gameID)
      io.sockets.in(data.gameID).emit('player joined', data)
    })
  })
}

// function joinGame (data) {
//   if (socket.manager.rooms['/' + data.gameID]) {

//   }

// }
