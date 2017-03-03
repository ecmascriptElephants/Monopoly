import React from 'react'
import { Redirect } from 'react-router-dom'

const Loading = () => {
  return (
    <Redirect to={{ pathname: '/board' }} />
  )
}

export default Loading
