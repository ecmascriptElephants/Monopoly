import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      username: '',
      id: 0
    }
    axios.get('/user')
    .then((res) => {
      this.setState({username: res.data.displayName})
      sock.playerJoined(res.data)
    })
  }
  componentDidMount () {
    sock.socket.on('start game', (data) => {
      this.setState({button: true})
      this.setState({id: data})
    })
  }
  render () {
    return (
      <div>
        {
          this.state.button ? <Link to={`/board:${this.state.id}`}><div> Hello </div></Link> : <div> Hello </div>
         }
        <span>{this.state.username}</span>
      </div>
    )
  }
}

export default Lobby
