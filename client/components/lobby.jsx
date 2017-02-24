import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID, setMyIndex, setDefaultState, setState } from './store/actionCreators'
import Toast from './toast'
import axios from 'axios'
// import { Button } from 'semantic-ui-react'
import LoadGame from './LoadGame'
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      join: false,
      start: false,
      messages: [],
      showToast: false,
      comment: '',
      queryResults: [],
      pendingGames: [],
      resume: true
    }
    this.props.dispatch(setDefaultState())
    this.props.dispatch(setUsername(localStorage.displayname))
    this.props.dispatch(setUserID(localStorage.id))
    sock.userJoined({ id: localStorage.id, displayName: localStorage.displayname })

    this.joinGame = this.joinGame.bind(this)
    this.newGame = this.newGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.sendChat = this.sendChat.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.getChats = this.getChats.bind(this)
  }
  componentDidMount () {
    // localStorage.removeItem('state')
    sock.socket.on('new game', (data) => {
      this.setState({ join: true })
      localStorage.setItem('gameID', data.gameID)
      this.props.dispatch(setGameID(data.gameID))
    })

    sock.socket.on('pending games', (pendingGames) => {
      this.setState({ pendingGames })
    })

    sock.socket.on('your index', (data) => {
      this.props.dispatch(setMyIndex(data))
    })

    sock.socket.on('player joined', (data) => {
      this.setState({
        join: false,
        start: true,
        showToast: true,
        comment: 'Player joined'
      })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('player started', (data) => {
      this.setState({
        join: false,
        start: true
      })
    })
    sock.socket.on('send message', (data) => {
      this.setState({})
    })
    sock.socket.on('receive-message', (msg) => {
      let messages = this.state.messages
      messages.push(msg)
      this.setState({ messages: messages })
    })
    sock.socket.on('load state', (state) => {
      this.props.dispatch(setState(state))
      this.setState({resume: false})
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
    sock.sendChat({ senderID: this.props.senderID, messageID: this.props.messageID })
  }

  submitMessage () {
    let message = document.getElementById('message').value
    document.getElementById('message').value = ''
    let sender = this.props.username
    let room = 'lobby'
    let msgInfo = { sender: sender, message: message, room: room }
    JSON.stringify(msgInfo)
    sock.socket.emit('new-message', msgInfo)
  }

  getChats (e) {
    e.preventDefault()
    let room = document.getElementById('room').value
    let keyword = document.getElementById('keyword').value
    let date = document.getElementById('date').value
    document.getElementById('keyword').value = ''
    axios.post('/chats', { room: room, keyword: keyword, date: date })
      .then((res) => {
        this.setState({ queryResults: res.data })
      })
      .catch((err) => console.error(err))
  }

  render () {
    let messages = this.state.messages.map((msg) => {
      return <li>{this.props.username}: {msg}</li>
    })
    let queryResults = this.state.queryResults.map((result) => {
      return <li>Sender: {result.sender} Message: {result.message} Room: {result.room}</li>
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
        <br />
        <div>
          <form onSubmit={this.getChats}>
            <input type='text' placeholder='keyword' id='keyword' />
            <select id='room' name='room'>
              <option>All Rooms</option>
              <option value='lobby'>Lobby</option>
              <option value='board'>Board</option>
            </select>

            <select id='date'>
              <option>This Week</option>
              <option value='thisWeek'>This Month</option>
              <option value='thisYear'>This Year</option>
            </select>
            <button type='submit'>Show chats</button>
          </form>
          <p> You have total of {this.state.queryResults.length} messages </p>
          <ul>
            {queryResults}
          </ul>
          <LoadGame pendingGames={this.state.pendingGames} load={this.state.resume} />
        </div>
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
  // senderID: React.PropTypes.number.isRequired,
  messageID: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Lobby)
