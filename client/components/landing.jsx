import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
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
          <Input focus fluid placeholder='Password' type='password' />
          <Divider horizontal />
          <Button secondary fluid>Login</Button>
          <Divider horizontal>Or</Divider>
          <Link to='/signup'> <Button secondary fluid>Sign Up</Button></Link>
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
