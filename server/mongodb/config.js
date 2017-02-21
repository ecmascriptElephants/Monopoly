let mongoose = require('mongoose')
let mongoUri = 'mongodb://'

let mongodb = mongoose.connect(mongoUri)

module.exports = mongodb
