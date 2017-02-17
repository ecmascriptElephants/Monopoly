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
      data.socketID = socket.id
      game[gameID] = {i: 0, playerInfo: [data]}
      socket.join(gameID.toString())
    })

    socket.on('join', (data) => {
      var obj = game[data.gameID]
      data.socketID = socket.id
      socket.join(data.gameID)
      obj.playerInfo.push(data)
      socket.broadcast.to(obj.playerInfo[obj.i].socketID).emit('player joined', data)
    })

    socket.on('start', (data) => {
      io.in(data.gameID).emit('player joined', data)
      socket.emit('redirect')
    })

    socket.on('load', (data) => {
      let obj = game[data.gameID]
      // console.log(obj.playerInfo[obj.i].socketID)
      io.emit('users', {players: obj['playerInfo']})
      // console.log(obj.playerInfo[obj.])
      // console.log(obj[data.gameID])
      // console.log('how many times', obj.playerInfo[obj.i].socketID)
      socket.broadcast.to(obj.playerInfo[obj.i].socketID).emit('yourTurn')
    })

    socket.on('endTurn', (data) => {
      let obj = game[data.gameID]
      obj.i++
      if (obj.i >= obj.playerInfo.length) {
        obj.i = 0
      }
      socket.broadcast.to(obj.playerInfo[obj.i].socketID).emit('yourTurn')
    })
  })
}
