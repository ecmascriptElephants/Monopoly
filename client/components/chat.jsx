import React, { Component } from 'react'
import {Header, Container, Segment, Icon, Divider} from 'semantic-ui-react'
import sock from '../helper/socket'

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name,
      messages: []
    }
    this.submitMessage = this.submitMessage.bind(this)
  }
  componentDidMount () {
    sock.socket.on('receive-message', (msg) => {
      let messages = this.state.messages
      messages.push(msg)
      this.setState({messages: messages})
    })
  }

  submitMessage () {
    let message = document.getElementById('chatBox').value
    document.getElementById('chatBox').value = ''
    let sender = this.state.name
    let room = 'board'
    let msgInfo = {sender: sender, message: message, room: room}
    JSON.stringify(msgInfo)
    sock.socket.emit('new-message', msgInfo)
  }

  render () {
    let messages = this.state.messages.map((msg) => {
      return <li>{this.state.name}: {msg}</li>
    })
    return (
      <Container className='chatBox'>
        <Segment raised vertical compact className='content'>
          <Header as='h6' icon textAlign='center'>
            <Icon name='users' circular />
            <Header.Content>
              {this.state.name}
            </Header.Content>
          </Header>
          <Divider />
          <div>
            <ul>
              {messages}
            </ul>
          </div>
          <input id='chatBox' name='chatBox' type='text' />
          <button onClick={this.submitMessage}>Send</button>
        </Segment>
      </Container>
    )
  }
}

Chat.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default Chat
