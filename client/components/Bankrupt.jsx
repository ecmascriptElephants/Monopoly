import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import {
  setUserProperties,
  setUserCash
} from './store/actionCreators'

const Bankrupt = (props) => {

  const checkBankruptcy = () => {
    let usersProperties = [...props.userPropertiesArray[props.playerIndex]]
    if (usersProperties.length === 0) {
      props.dispatch(setBankruptcy(true))
    }
  }

  const handleBankrupt = () => {
    let tempProperties = [...props.userPropertiesArray[props.playerIndex]]
    let tempCash = [...props.userCashArray[props.playerIndex]]
    tempProperties = []
    tempCash = 0
    props.dispatch(setUserProperties(tempProperties, props.playerIndex))
    props.dispatch(setUserCash(tempCash, props.playerIndex))
  }
  return (
    <Button onClick={() => { handleBankrupt() }}>Bankruptcy</Button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex
  }
}

Bankrupt.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  playerIndex: React.PropTypes.number.isRequired,

}
export default connect(mapStateToProps)(Bankrupt)
