let game = {}
let msgHistory = require('../controllers/msgHistoryController')
const location = [
  [97, 97], [97, 83], [97, 75], [97, 66.5], [97, 58.5], [97, 50], [97, 42], [97, 34], [97, 25.5], [97, 17.5], [97, 2.5],
  [84.5, 2.5], [76.4, 2.5], [68.2, 2.5], [60, 2.5], [51.8, 2.5], [43.5, 2.5], [35.4, 2.5], [27.1, 2.5], [19, 2.5], [7, 2.5],
  [7, 17.5], [7, 25.5], [7, 34], [7, 42], [7, 50], [7, 58.5], [7, 66.5], [7, 75], [7, 83],
  [7, 97], [19, 97], [27.1, 97], [35.4, 97], [43.5, 97], [51.8, 97], [60, 97], [68.2, 97], [76.4, 97], [84.5, 97]
]
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
      console.log('in routes/io.js socket.on "load"; data = ', data)
      let gameObj = game[data.gameID]
      let refresh = false
      if (gameObj.playerInfo[data.index].socketID !== socket.id) {
        refresh = true
        gameObj.playerInfo[data.index].socketID = socket.id
      }
      if (!refresh) {
        io.emit('users', { players: gameObj['playerInfo'] })
        socket.broadcast.to(gameObj.playerInfo[0].socketID).emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
      } else {

        if (data.index === gameObj.i) {
          socket.emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
        }
      }
    })

    socket.on('endTurn', (data) => {
      let gameObj = game[data.gameID]
      gameObj.i++
      if (gameObj.i >= gameObj.playerInfo.length) {
        gameObj.i = 0
      }
      gameObj['playerInfo'][data.index].userPosition = location[data.pos]
      socket.broadcast.to(gameObj.playerInfo[gameObj.i].socketID).emit('yourTurn', { index: gameObj.i, numOfPlayers: gameObj.playerInfo.length })
    })

    socket.on('dice rolled', (data) => {
      socket.broadcast.to(data.gameID).emit('update position', { pos: data.pos, index: data.index })
    })

    socket.on('new-message', (msgInfo) => {
      io.emit('receive-message', msgInfo.message)
      let sender = msgInfo.sender
      let message = msgInfo.message
      let room = msgInfo.room
      msgHistory.addMessage(sender, message, room)
    })

    socket.on('property update', (data) => {
      socket.broadcast.to(data.gameID).emit('update properties', { properties: data.properties, index: data.index })
    })

    socket.on('money update', (data) => {
      socket.broadcast.to(data.gameID).emit('update money', { money: data.money, index: data.index })
    })
  })
}
