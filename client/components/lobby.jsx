import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import axios from 'axios'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID, setMyIndex } from './store/actionCreators'
import Toast from './toast'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      join: false,
      start: false,
      messages: [],
      showToast: false,
      comment: ''
    }
    axios.get('/user')
      .then((res) => {
        this.props.dispatch(setUsername(res.data.displayName))
        this.props.dispatch(setUserID(res.data.id))
        sock.userJoined(res.data)
      })

    this.joinGame = this.joinGame.bind(this)
    this.newGame = this.newGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.sendChat = this.sendChat.bind(this)
  }
  componentDidMount () {
    sock.socket.on('new game', (data) => {
      this.setState({ join: true })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('your index', (data) => {
      this.props.dispatch(setMyIndex(data))
    })
    sock.socket.on('player joined', (data) => {
      this.setState({ join: false,
        start: true,
        showToast: true,
        comment: 'Player joined'
      })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('send message', (data) => {
      this.setState({})
    })
    sock.socket.on('receive-message', (msg) => {
      let messages = this.state.messages
      messages.push(msg)
      this.setState({messages: messages})
      // console.log('messages', this.state.messages)
    })
  }
  newGame () {
    sock.newGame({ username: this.props.username, userID: this.props.userID })
  }

  joinGame () {
    sock.join({ username: this.props.username, userID: this.props.userID, gameID: this.props.gameID })
  }

  startGame () {
    sock.start({ gameID: this.props.gameID })
  }

  sendChat () {
    sock.sendChat({senderID: this.props.senderID, messageID: this.props.messageID})
  }

  submitMessage () {
    let message = document.getElementById('message').value
    sock.socket.emit('new-message', message)
  }

  render () {
    let messages = this.state.messages.map((msg) => {
      return <li>{msg}</li>
    })
    return (
      <div>
        <div>
          <button onClick={this.newGame}> New Game </button>
          {this.state.join ? <button onClick={this.joinGame}> Join Game </button> : null}
          {this.state.start ? <Link to='/board'><button onClick={this.startGame}> Start Game </button></Link> : null}
          <span>{this.props.username}</span>
        </div>

        <div>
          <ul>
            {messages}
          </ul>
          <input id='message' type='text' /><button onClick={this.submitMessage}>Send</button>
        </div>
        <Toast message={this.state.comment} show={this.state.showToast} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    messageID: state.messageID
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  senderID: React.PropTypes.number.isRequired,
  messageID: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Lobby)
