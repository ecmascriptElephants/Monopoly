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
        console.log(req)
        localStorage.setItem('token', req.data.token)
        this.setState({promise: true})
      })
  }

  render () {
    console.log(this.state.promise)
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
