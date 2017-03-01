import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toaster from './toast'
import {Header, Container, Segment, Divider} from 'semantic-ui-react'

class ToastHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: []
    }
    this.handleMessage = this.handleMessage.bind(this)
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
    return (
      <Container className='toastHistory'>
        <Segment raised vertical compact className='content'>
          <Header as='h6' icon textAlign='center'>
            <Header.Content>Activity Logs</Header.Content>
          </Header>
          <Divider />
          <div />
        </Segment>
      </Container>
    )
  }

}

ToastHistory.propTypes = {
  message: React.PropTypes.string.isRequired
}
export default ToastHistory
