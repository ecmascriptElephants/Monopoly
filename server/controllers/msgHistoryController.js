const msgHistory = require('../models/msgHistory')

module.exports = {

  addMessage: (sender, message, room) => {
    msgHistory.create({
      sender: sender,
      message: message,
      room: room
    })
  },

  allHistory: (keyword, res) => {
    msgHistory.find({message: {$regex: keyword}}, (err, chats) => {
      if (err) res.status(500).send(err)
      else res.send(chats)
    })
  },

  historyByQuery: (room, keyword, res) => {
    msgHistory.find({room: room, message: {$regex: keyword}}, (err, chats) => {
      if (err) res.status(500).send(err)
      else res.send(chats)
    })
  }

}
