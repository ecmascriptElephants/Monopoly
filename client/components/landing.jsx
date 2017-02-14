import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider } from 'semantic-ui-react'
import axios from 'axios'
class Land extends Component {
  // constructor (props) {
  //   super(props)
  //   this.FB = props.fb
  //   this.state = {
  //     message: ''
  //   }
  // }
  //
  // componentDidMount () {
  //   this.FB.Event.subscribe('auth.logout',
  //     this.onLogout.bind(this))
  //   this.FB.Event.subscribe('auth.statusChange',
  //     this.onStatusChange.bind(this))
  // }
  //
  // onStatusChange (response) {
  //   console.log(response)
  //   var self = this
  //
  //   if (response.status === 'connected') {
  //     this.FB.api('/me', function (response) {
  //       var message = 'Welcome ' + response.name
  //       self.setState({
  //         message: message
  //       })
  //     })
  //   }
  // }
  //
  // onLogout (response) {
  //   this.setState({
  //     message: ''
  //   })
  // }
  handleFBSubmit () {
    axios.get('/auth/facebook')
      .then((res) => console.log('make request'))
      .catch((err) => console.error(err, 'here'))
    console.log('fb button clicked!')
  }
  render () {
    return (
      <Container>
        <Segment raised vertical compact>
          <Header as='h2' icon textAlign='center'>
            <Icon name='users' circular />
            <Header.Content>
              Hackopoly
      </Header.Content>
          </Header>
          <Input focus fluid placeholder='Username' />
          <Divider horizontal />
          <Input focus fluid placeholder='Password' />
          <Divider horizontal />
          <Button secondary fluid>Login</Button>
          <Divider horizontal>Or</Divider>
          <Button secondary fluid>Sign Up</Button>
          <Divider horizontal />
          <Button fluid color='facebook' href='/auth/facebook'>
            <Icon name='facebook' /> Facebook
    </Button>
        </Segment>
      </Container>
    )
  }
}

export default Land
