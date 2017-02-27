import React from 'react'
import { connect } from 'react-redux'
import {
  setUserProperties
} from './store/actionCreators'

const Mortgage = (props) => {
  const mortgageProperty = (propertyName) => {
    let tempProperties = [...props.userPropertiesArray[props.playerIndex]]
    console.log(tempProperties)
    let mortgageAmount = 0
    tempProperties.forEach((property) => {
      if (property.PropertyObj.NAME === props.propertyName) {
        property.Mortgaged = true
        mortgageAmount = property.PropertyObj.MORTGAGE_PRICE
      }
    })
    props.dispatch(setUserProperties(tempProperties, props.playerIndex))
    props.increaseFunds(mortgageAmount)
  }
  return (
    <button onClick={() => { mortgageProperty() }}>Mortgage</button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex
  }
}

Mortgage.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  propertyName: React.PropTypes.string.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  increaseFunds: React.PropTypes.func.isRequired
}
export default connect(mapStateToProps)(Mortgage)
