import io from 'socket.io-client'
import Dice from '../components/dice_roll'
import React from 'react'
const socket = io.connect('/')

module.exports = {
  playerJoined: function (userInfo) {
    socket.emit('player joined', userInfo)
  },
  socket
}

socket.on('start game', () => {
  <Dice dice='true' />
})
