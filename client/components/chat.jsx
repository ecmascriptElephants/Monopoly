import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID } from './store/actionCreators'

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      send: false
    }

  }
  render() {
    return (
      <div> in chat file </div>
    )
  }
}

export default Chat
