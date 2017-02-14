import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider } from 'semantic-ui-react'
class Land extends Component {

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
