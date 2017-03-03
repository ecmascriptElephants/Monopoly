import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import Authenticate from '../helper/authenticate'

class Land extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      valid: false
    }
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount () {
    let video = document.getElementById('monoLanding')
    video.addEventListener('canplay', () => {
      video.play()
    })
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value})
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleLogin (e) {
    e.preventDefault()
    axios.post('/login', this.state)
    .then((res) => {
      window.localStorage.setItem('token', res.data.token)
      window.localStorage.setItem('displayname', res.data.user.displayname)
      window.localStorage.setItem('id', res.data.user.id)
      this.setState({valid: true})
    })
    .catch((err) => console.error(err))
  }


  render () {
    return (
      <div>
        <div id='videoContainer'>
          <Container className='landingForm'>
            <Segment vertical compact>
              <Header as='h1' icon textAlign='center'>
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
            {
               this.state.valid ? Authenticate.isAuth() ? <Redirect to={{ pathname: '/lobby' }} /> : <Redirect to={{ pathname: '/' }} /> : null
            }
          </Container>
        </div>
        <video id='monoLanding' className='video' loop>
          <source src='mono.mp4' type='video/mp4' />
          <source src='mono.ogv' type='video/ogg' />
          <source src='mono.webm' type='video/webm' />
        </video>
      </div>
    )
  }
}

export default Land
