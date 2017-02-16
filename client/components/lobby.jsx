import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
import { connect } from 'react-redux'
import { setUsername, setGameID } from './store/actionCreators'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      join: false,
      start: false
    }
    axios.get('/user')
      .then((res) => {
        this.props.dispatch(setUsername(res.data.displayName))
        sock.userJoined(res.data)
      })

    this.joinGame = this.joinGame.bind(this)
  }
  componentDidMount () {
    sock.socket.on('new game', (data) => {
      this.setState({ join: true })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('player joined', () => {
      this.setState({join: false, start: true})
    })
  }
  newGame () {
    sock.newGame()
  }

  joinGame () {
    sock.join(this.props.gameID)
  }

  render () {
    return (
      <div>
        <button onClick={this.newGame}> New Game </button>
        {this.state.join ? <button onClick={this.joinGame}> Join Game </button> : null }
        {this.state.start ? <button onClick={this.startGame}> Start Game </button> : null }
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
    username: state.username,
    gameID: state.gameID
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Lobby)
