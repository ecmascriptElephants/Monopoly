import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import axios from 'axios'

class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value})
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleSignup (e) {
    e.preventDefault()
    axios.post('/signup', this.state)
    .then((res) => console.log('make request'))
    .catch((err) => console.error(err))
  }

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
          <Form onSubmit={this.handleSignup}>
            <Input focus fluid name='username' placeholder='Username' onChange={this.onUsernameChange} />
            <Divider horizontal />
            <Input focus fluid name='password' placeholder='Password' type='password' onChange={this.onPasswordChange} />
            <Divider horizontal />
            <Button secondary fluid type='submit'>Sign Up</Button>
          </Form>
          <Divider horizontal />
        </Segment>
      </Container>
    )
  }
}

export default Signup
