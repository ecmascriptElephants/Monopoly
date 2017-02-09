const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const routes = ('./routes/routes.js')

const app = express()
const port = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../index')))
// routes(app, express)

app.listen(port, () => {
  console.log('Listening on port ', port)
})

module.exports = app
