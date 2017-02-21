const msgHistory = require('../models/msgHistory')

module.exports = {

  addMessage: (sender, message, room) => {
    msgHistory.create({
      Sender: sender,
      Message: message,
      Room: room
    })
  },

  allHistory: (req, res) => {
    msgHistory.find((err, chats) => {
      if (err) res.status(500).send(err)
      else res.send(chats)
    })
  },

  historyByRoom: (room) => {

  }

}
