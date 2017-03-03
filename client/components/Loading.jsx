import React from 'react'
import { Redirect } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'
const Loading = () => {
  return (
    <Dimmer active>
      <Loader />
    </Dimmer>
  )
}

export default Loading
