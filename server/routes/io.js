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
    })

    socket.on('load', (data) => {
      let gameObj = game[data.gameID]
      io.emit('users', { players: gameObj['playerInfo'] })
      socket.broadcast.to(gameObj.playerInfo[0].socketID).emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
    })

    socket.on('refresh', (data) => {
      console.log('recieving refresh')
      console.log(socket.id)
      let gameObj = game[data.gameID]
      let index = -1
      for (let i = 0; i < gameObj.playerInfo.length; i++) {
        if (gameObj['playerInfo'][i].userID === data.userID) {
          index = i
          gameObj.playerInfo[i].socketID = socket.id
        }
      }
     socket.broadcast.to(socket.id).emit('refresh data', { players: gameObj['playerInfo'] })
      if (index === gameObj.i) {
        socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
      }
    })

    socket.on('endTurn', (data) => {
      let gameObj = game[data.gameID]
      gameObj.i++
      if (gameObj.i >= gameObj.playerInfo.length) {
        gameObj.i = 0
      }
      io.in(data.gameID).emit('update position', { pos: data.pos, index: data.index })
      socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
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
      socket.broadcast.to(data.gameID).emit('update properties', { properties: data.properties, index: data.index })
    })

    socket.on('money update', (data) => {
      socket.broadcast.to(data.gameID).emit('update money', { money: data.money, index: data.index })
    })
  })
}
