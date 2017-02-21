let game = {}
module.exports = (io) => {
  let user = 0
  let userStorage = []
  io.on('connection', function (socket) {
    socket.on('user joined', (data) => {
      userStorage.push(data)
      user++
    })
    socket.on('new game', (data) => {
      let gameID = 1
      socket.broadcast.emit('new game', { gameID, socketID: socket.id })
      data.socketID = socket.id
      data.userPosition = [97, 97]
      game[gameID] = { players: 1, i: 0, playerInfo: [data] }
      console.log(socket.id)
      io.to(socket.id).emit('your index', game[gameID].players - 1)
      socket.join(gameID.toString())
    })

    socket.on('join', (data) => {
      let gameObj = game[data.gameID]
      gameObj.players++
      data.socketID = socket.id
      data.userPosition = [97, 97]
      socket.join(data.gameID)
      gameObj.playerInfo.push(data)
      io.to(socket.id).emit('your index', gameObj.players - 1)
      socket.broadcast.to(gameObj.playerInfo[0].socketID).emit('player joined', data)
    })

    socket.on('start', (data) => {
      io.in(data.gameID).emit('player joined', data)
      socket.emit('redirect')
    })
    socket.on('reconnect', (data) => {
      console.log(data, 'someone tried to reconnect')
    })
    socket.on('load', (data) => {
      console.log(socket.id)
      let gameObj = game[data.gameID]
      io.emit('users', { players: gameObj['playerInfo'] })
      socket.broadcast.to(gameObj.playerInfo[0].socketID).emit('yourTurn', {index: gameObj.i, numOfPlayers: gameObj.playerInfo.length})
    })

    socket.on('endTurn', (data) => {
      let gameObj = game[data.gameID]
      gameObj.i++
      if (gameObj.i >= gameObj.playerInfo.length) {
        gameObj.i = 0
      }
      io.in(data.gameID).emit('update position', { pos: data.pos, index: data.index })
      socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('yourTurn', {index: gameObj.i, numOfPlayers: gameObj.playerInfo.length})
    })

    socket.on('dice rolled', (data) => {
      socket.broadcast.to(data.gameID).emit('update position', { pos: data.pos, index: data.index })
    })

    socket.on('new-message', (msg) => {
      // console.log('msg', msg)
      io.emit('receive-message', msg)
    })
    socket.on('property bought', (data) => {
      socket.broadcast.to(data.gameID).emit('update properties', { properties: data.properties, index: data.index })
    })
  })
}

