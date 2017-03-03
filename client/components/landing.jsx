import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import Authenticate from '../helper/authenticate'
import escape from 'lodash.escape'

class Land extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      promise: false,
      auth: false
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
    this.setState({username: escape(e.target.value)})
  }

  onPasswordChange (e) {
    this.setState({password: escape(e.target.value)})
  }

  handleLogin (e) {
    e.preventDefault()
    console.log('handleLOGIN has been invoked!!!')
    axios.post('/login', this.state)
    .then((res) => {
      window.localStorage.setItem('token', res.data.token)
      window.localStorage.setItem('displayname', res.data.user.displayname)
      window.localStorage.setItem('id', res.data.user.id)
      window.localStorage.setItem('picture', res.data.picture)
    })
    .catch((err) => console.error(err))
    .then(() => {
      axios.post('/tokenauth', { token: window.localStorage.token })
        .then((res) => {
          console.log(res.data)
          if (res.data.validToken) {
            this.setState({auth: true})
          }
        })
        .catch((err) => console.error(err))
        .then(() => {
          this.setState({promise: true})
        })
    })
  }


  render () {
    return (
      <div>
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
            (this.state.promise && this.state.auth) ? <Redirect to={{ pathname: '/lobby' }} /> : null
          }
        </Container>

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
