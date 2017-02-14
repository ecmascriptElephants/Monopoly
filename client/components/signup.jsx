import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider } from 'semantic-ui-react'

class Signup extends Component {
  render () {
    return (
      <Container>
        <Segment raised vertical compact>
          <Header as='h2' icon textAlign='center'>
            <Icon name='users' circular />
            <Header.Content>
              Signup!
            </Header.Content>
          </Header>
          <Input focus fluid placeholder='Username' />
          <Divider horizontal />
          <Input focus fluid placeholder='Password' />
          <Divider horizontal />
          <Button secondary fluid>Sign Up</Button>
          <Divider horizontal />
        </Segment>
      </Container>
    )
  }
}

export default Signup
