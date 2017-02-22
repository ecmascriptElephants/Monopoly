import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import 'whatwg-fetch'
class Land extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value})
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleLogin (e) {
    e.preventDefault()
    console.log('here')
    axios.post('/login', this.state)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err))
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
          <Form onSubmit={this.handleLogin}>
            <Input focus fluid name='username' placeholder='Username' onChange={this.onUsernameChange} />
            <Divider horizontal />
            <Input focus fluid name='password' placeholder='Password' type='password' onChange={this.onPasswordChange} />
            <Divider horizontal />
            <Button secondary fluid type='submit'>Login</Button>
          </Form>
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
