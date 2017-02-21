import React, { Component } from 'react'
import { Header, Container, Segment, Icon, Divider, Message, Input, Button } from 'semantic-ui-react'
import sock from '../helper/socket'

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name,
      messages: []
    }

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
    // console.log('in chat box', message)
    sock.socket.emit('new-message', message)
  }

  render() {
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
          <input id= 'chatBox' name='chatBox' type='text' />
          <button onClick={this.submitMessage}>Send </button>
        </Segment>
      </Container>
    )
  }
}

export default Chat
