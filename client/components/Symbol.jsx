import React from 'react'
import { Image } from 'semantic-ui-react'
const Symbol = (props) => {
  const left = props.left
  const top = props.top

  return (
    <div className='symbol' style={{ left, top }}>
      <Image size='small' shape='circular' src={`${props.picture}`} />
    </div>
  )
}

Symbol.propTypes = {
  left: React.PropTypes.string.isRequired,
  top: React.PropTypes.string.isRequired,
  picture: React.PropTypes.string.isRequired
}

export default Symbol
