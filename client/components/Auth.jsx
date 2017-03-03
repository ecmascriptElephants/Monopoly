import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Authenticate from '../helper/authenticate'
import axios from 'axios'
export default class Auth extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      promise: false
    }
  }

  componentWillMount () {
    axios.get('/get-info')
      .then((res) => {
        window.localStorage.setItem('token', res.data.token)
        window.localStorage.setItem('displayname', res.data.user.displayName)
        window.localStorage.setItem('id', res.data.user.id)
        window.localStorage.setItem('picture', res.data.picture)
        this.setState({promise: true})
      })
      .catch((err) => {
        this.setState({promise: true})
        console.log(err)
      })
  }

  render () {
    return (
      <div>
        {
           this.state.promise ? Authenticate.isAuth() ? <Redirect to={{ pathname: '/lobby' }} /> : <Redirect to={{ pathname: '/' }} /> : null
        }
      </div>
    )
  }
}
