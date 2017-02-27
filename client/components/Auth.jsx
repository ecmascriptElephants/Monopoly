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
      .then((req) => {
        window.localStorage.setItem('token', req.data.token)
        window.localStorage.setItem('displayname', req.data.user.displayName)
        window.localStorage.setItem('id', req.data.user.id)
        this.setState({promise: true})
      })
      .catch((err) => console.log(err))
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

Auth.propTypes = {
  router: React.PropTypes.object.isRequired
}
