const msgHistory = require('../models/msgHistory')

module.exports = {

  addMessage: (sender, message, next) => {
    msgHistory.create({
      Sender: sender,
      Message: message
    })
  },

  allHistory: (req, res, next) => {

  }
}
