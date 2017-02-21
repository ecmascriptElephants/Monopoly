const mongoose = require('mongoose')

const msgHistory = new mongoose.Schema({
  Sender: String,
  Message: String
})

module.exports = mongoose.model('msgHistory', msgHistory)
