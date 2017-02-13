import React from 'react'

const Symbol = function (props) {
  var left = props.left
  var top = props.top
  return (
    <div className='symbol' style={{left, top}}>
      <img id='tophat' alt='' src='http://www.spore.com/static/avatar/500/231/078/black-top-hat.jpg' />
    </div>
  )
}

Symbol.propTypes = {
  left: React.PropTypes.string.isRequired,
  top: React.PropTypes.string.isRequired
}

export default Symbol
