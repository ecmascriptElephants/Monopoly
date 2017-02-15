import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      username: ''
    }
    axios.get('/user')
    .then((res) => {
      this.setState({username: res.data.displayName})
      sock.playerJoined(res.data)
    })
  }
  componentDidMount () {
    sock.socket.on('start game', () => {
      this.setState({button: true})
      console.log(this.state.button)
    })
  }
  render () {
    return (
      <div>
        {
          this.state.button ? <Link to='/board'><div> Hello </div></Link> : <div> Hello </div>
         }
        <span>{this.state.username}</span>
      </div>
    )
  }
}

export default Lobby
