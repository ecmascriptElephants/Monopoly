import React from 'react'
import Toast from 'essence-toast'
const Toaster = (props) => {
  return (
    <Toast classes={'e-text-white'} visible={props.show} delay={5000}>
      {props.message}
    </Toast>
  )
}

Toaster.propTypes = {
  message: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired
}

export default Toaster
