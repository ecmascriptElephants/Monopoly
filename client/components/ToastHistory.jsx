import React from 'react'
import { connect } from 'react-redux'
import Toaster from './toast'
import {Header, Container, Segment, Icon, Divider} from 'semantic-ui-react'

const ToastHistory = (props) => {

  return (
    <Container className='toastHistory'>
      <Segment raised vertical compact className='content'>
        <Header as='h6' icon textAlign='center'>
          <Header.Content>Activity Logs</Header.Content>
        </Header>
        <Divider />
        <div>
          <Toaster />
        </div>
      </Segment>
    </Container>
  )
}

ToastHistory.propTypes = {

}
export default ToastHistory
