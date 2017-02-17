import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID } from './store/actionCreators'
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
        this.props.dispatch(setUserID(res.data.id))
        sock.userJoined(res.data)
      })

    this.joinGame = this.joinGame.bind(this)
    this.newGame = this.newGame.bind(this)
  }
  componentDidMount () {
    sock.socket.on('new game', (data) => {
      this.setState({ join: true })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('player joined', (data) => {
      this.setState({join: false, start: true})
      this.props.dispatch(setGameID(data.gameID))
    })
  }
  newGame () {
    sock.newGame({username: this.props.username, userID: this.props.userID})
  }

  joinGame () {
    sock.join({username: this.props.username, userID: this.props.userID, gameID: this.props.gameID})
  }

  startGame () {
    sock.start()
  }

  render () {
    return (
      <div>
        <button onClick={this.newGame}> New Game </button>
        {this.state.join ? <button onClick={this.joinGame}> Join Game </button> : null }
        {this.state.start ? <Link to='/board'><button onClick={this.startGame}> Start Game </button></Link> : null }
        <span>{this.props.username}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(Lobby)
