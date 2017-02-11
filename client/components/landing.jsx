import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider } from 'semantic-ui-react'
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
          <Button fluid color='facebook'>
            <Icon name='facebook' /> Facebook
    </Button>
        </Segment>
      </Container>
    )
  }
}

export default Land
