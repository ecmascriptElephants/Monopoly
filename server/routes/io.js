let game = {}
let msgHistory = require('../controllers/msgHistoryController')

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
      game[gameID] = { i: 0, playerInfo: [data] }
      socket.join(gameID.toString())
    })

    socket.on('join', (data) => {
      let gameObj = game[data.gameID]
      data.socketID = socket.id
      data.userPosition = [97, 97]
      socket.join(data.gameID)
      gameObj.playerInfo.push(data)
      console.log('in io.js socket.on join, data = ', data)
      socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('player joined', data)
    })

    socket.on('start', (data) => {
      io.in(data.gameID).emit('player joined', data)
      socket.emit('redirect')
    })

    socket.on('load', (data) => {
      let gameObj = game[data.gameID]
      // console.log(gameObj.playerInfo[gameObj.i].socketID)
      io.emit('users', { players: gameObj['playerInfo'] })
      // console.log(gameObj.playerInfo[gameObj.])
      // console.log(gameObj[data.gameID])
      // console.log('how many times', gameObj.playerInfo[gameObj.i].socketID)
      socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('yourTurn', {index: gameObj.i, numOfPlayers: gameObj.playerInfo.length})
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

    socket.on('new-message', (msgInfo) => {
      io.emit('receive-message', msgInfo.message)
      let sender = msgInfo.sender
      let message = msgInfo.message
      console.log('sender', sender)
      msgHistory.addMessage(sender, message)
    })

    socket.on('property update', (data) => {
      console.log('io.js property update has been invoked! data.properties = ', data.properties, 'data.gameID = ',data.gameID, 'data = ', data)
      socket.broadcast.to(data.gameID).emit('update properties', { properties: data.properties, index: data.index })
    })

    socket.on('money update', (data) => {
      console.log('io.js money update has been invoked! data.properties = ', data.money, 'data.gameID = ',data.gameID, 'data = ', data)
      socket.broadcast.to(data.gameID).emit('update money', { money: data.money, index: data.index })
    })

  })
}
