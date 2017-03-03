import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID, setMyIndex, setDefaultState, setState } from './store/actionCreators'
import Toast from './toast'
import axios from 'axios'
import LoadGame from './LoadGame'
import { Input, Button, List, Image, Menu, Message } from 'semantic-ui-react'
import { Motion, spring, TransitionMotion } from 'react-motion'
import Nav from './nav'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar'

const springPreset = { wobbly: [130, 11] }
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      join: true,
      start: false,
      messages: [],
      showToast: false,
      comment: '',
      queryResults: [],
      pendingGames: [],
      resume: true,
      games: {},
      userMessage: '',
      showGames: true,
      showNewGameButton: true,
      onlineUser: []
    }

    this.props.dispatch(setDefaultState())
    this.props.dispatch(setUsername(window.localStorage.displayname))
    this.props.dispatch(setUserID(window.localStorage.id))
    sock.userJoined({ id: window.localStorage.id, displayName: window.localStorage.displayname, picture: window.localStorage.picture })

    this.joinGame = this.joinGame.bind(this)
    this.newGame = this.newGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.getChats = this.getChats.bind(this)
    this.signOut = this.signOut.bind(this)
    this.message = this.message.bind(this)
    this.setShowGames = this.setShowGames.bind(this)
  }
  componentDidMount () {
    sock.socked.on('user joined', (data) => {
      this.setState({onlineUsers: data})
    })
    sock.socket.on('get games', (data) => {
      this.setState({ games: data })
    })
    sock.socket.on('update games', (data) => {
      this.setState({ games: data })
    })
    sock.socket.on('new game', (data) => {
      this.setState({ games: data.newGame })
    })

    sock.socket.on('pending games', (pendingGames) => {
      this.setState({ pendingGames })
    })

    sock.socket.on('your index', (data) => {
      console.log('myIndex', data)
      this.props.dispatch(setMyIndex(data.index))
      this.setState({games: data.newGame})
    })

    sock.socket.on('player joined', (data) => {
      this.setState({
        join: false,
        start: true,
        showToast: true,
        comment: 'Player joined'
      })
      this.setState({
      })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('player started', (data) => {
      this.setState({
        join: true,
        start: true
      })
    })

    sock.socket.on('receive-message', (msgInfo) => {
      let messages = [...this.state.messages]
      messages.push(msgInfo)
      this.setState({ messages })
    })

    sock.socket.on('load state', (state) => {
      this.props.dispatch(setState(state))
      this.setState({ resume: false })
    })
  }
  newGame () {
    this.setState({showNewGameButton: false})
    sock.newGame({ username: this.props.username, userID: this.props.userID, picture: window.localStorage.picture })
  }

  joinGame () {
    this.setState({ join: false })
    sock.join({ username: this.props.username, userID: this.props.userID, gameID: this.props.gameID, picture: window.localStorage.picture })
  }

  startGame () {
    console.log(this.props.playerIndex)
    console.log(this.props.gameID)
    sock.start({ gameID: this.props.gameID })
  }

  submitMessage (e) {
    let sender = this.props.username
    let room = 'lobby'
    let msgInfo = { sender: sender, message: this.state.userMessage, room: room, picture: window.localStorage.picture }
    JSON.stringify(msgInfo)
    sock.socket.emit('new-message', msgInfo)
  }

  message (e) {
    this.setState({userMessage: e.target.value})
  }

  handleGameClick (gameID) {
    this.setState({ join: false })
    this.props.dispatch(setGameID(gameID))
    window.localStorage.setItem('gameID', gameID)
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

  signOut () {
    console.log('sign out called')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('displayname')
    window.localStorage.removeItem('id')
    this.setState({ promise: false })
  }

  getStyles () {
    let configs = {}
    this.state.messages.forEach((val, index) => {
      configs[val._id] = {
        opacity: spring(1),
        top: spring(0, springPreset.wobbly)
      }
    })
    return configs
  }

  willEnter (key) {
    return {
      opacity: spring(0),
      top: spring(100, springPreset.wobbly)
    }
  }

  setShowGames (bool) {
    this.setState({showGames: bool})
  }
  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Nav />
          <div className='lobby' >
            <div className='chat'>

              <div className='chat-container'>
                <Paper className='paper-chat' zDepth={5}>
                  <Toolbar className='headers' >
                    <ToolbarTitle text='Chat' className='title' />
                  </Toolbar>
                  <div className='messages'>
                    { this.state.messages.map((msg, i) => {
                      return <List>
                        <List.Item>
                          <Image avatar src={`${msg.picture}`} />
                          <List.Content>
                            <List.Header as='a'>{msg.sender}</List.Header>
                            <List.Description>{msg.message}</List.Description>
                          </List.Content>
                        </List.Item>
                      </List>
                    })}
                  </div>
                  <Input fluid placeholder='Type Here' id='message' onChange={this.message} action={<Button type='submit' size='large' color='teal' onClick={(e) => this.submitMessage(e)}> Send </Button>} />
                </Paper>
              </div>
            </div>
            <div className='col'>
              <div className='users'>
                <div className='user-container'>
                  <Paper className='paper-chat' zDepth={5}>
                    <Toolbar className='headers'>
                      <ToolbarTitle text='Online Users' className='title' />
                    </Toolbar>
                  </Paper>
                </div>
              </div>
              <div className='game'>
                <div className='user-container'>
                  <Paper className='paper-chat' zDepth={5}>
                    <Toolbar className='headers'>
                      <ToolbarTitle text='Games' className='title' />
                    </Toolbar>
                    <Menu widths={2} className='gameMenu'>
                      <Menu.Item name='New Game' onClick={() => this.setShowGames(true)} />
                      <Menu.Item name='Resume Game' onClick={() => this.setShowGames(false)} />
                    </Menu>
                    {this.state.showGames ? <div className='showMenuGame' ><div className='show-games'>
                      {Object.keys(this.state.games).map((item) => {
                        return <Button fluid key={item} onClick={() => { this.handleGameClick(this.state.games[item]) }}> Game: {item} </Button>
                      })}
                    </div>
                    
                      {this.state.start ? <div className='start'><Link to='/board'><Button color='green' size='massive' onClick={this.startGame}> Start Game </Button></Link></div> : this.state.showNewGameButton ? <Button.Group size='massive' fluid>
                        <Button color='green' onClick={() => this.newGame()}>New Game</Button>
                        <Button.Or />
                        <Button color='purple' disabled={this.state.join} onClick={() => this.joinGame()}>Join</Button>
                      </Button.Group> : this.state.join
                      ? <Message>
                        <Message.Header>Waiting for More Players</Message.Header>
                      </Message> : <Message>
                        <Message.Header>Waiting for Players to Join </Message.Header>
                      </Message>} </div>
                       : <div className='showMenuGame' >
                         <LoadGame pendingGames={this.state.pendingGames} load={this.state.resume} />
                       </div>
                  }
                  </Paper>
                </div>
              </div>
            </div>
          </div>
          <Toast message={this.state.comment} show={this.state.showToast} />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    messageID: state.messageID,
    playerIndex: state.playerIndex,
    bankruptcyButton: state.bankruptcyButton
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  messageID: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Lobby)
