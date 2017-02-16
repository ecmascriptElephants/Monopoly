import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
import { connect } from 'react-redux'
import { setUsername } from './store/actionCreators'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false
    }
    axios.get('/user')
    .then((res) => {
      this.props.dispatch(setUsername(res.data.displayName))
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
          this.state.button ? <Link to='/board'><div> Hello </div></Link> : <div> Hello </div>
         }
        <span>{this.props.username}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(Lobby)
