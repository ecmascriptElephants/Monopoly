import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toaster from './toast'
import {Header, Container, Segment, Icon, Divider} from 'semantic-ui-react'
import sock from '../helper/socket'


class ToastHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: []
    }
  }


  handleMessage (message) {
    let comments = this.state.comments
    comments.push(message)
    this.setState({comments: comments})
    comments = this.state.comments.map((msg, i) => {
      return <li key={i}>{msg}</li>
    })
  }
  render () {
<<<<<<< HEAD
    let comments = this.state.comments.map((comment, i) => {
      return <li key={i}>{comment}</li>
    })
    return (
      <Container className='toastHistory'>
      <Segment raised vertical compact className='content'>
      <Header as='h6' icon textAlign='center'>
      <Header.Content>Activity Logs</Header.Content>
      </Header>
      <Divider />
      <div>
        {comments}
      </div>
      </Segment>
      </Container>
    )
  }

}

ToastHistory.propTypes = {
  message: React.PropTypes.string.isRequired
}
export default ToastHistory
