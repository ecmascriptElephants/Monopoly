import React from 'react'
import { connect } from 'react-redux'
import {
  setUserProperties
} from './store/actionCreators'

const UnMortgage = (props) => {
  const unmortgageProperty = (propertyName) => {
    let tempProperties = [...props.userPropertiesArray[props.playerIndex]]
    console.log(tempProperties)
    let mortgageAmount = 0
    tempProperties.forEach((property) => {
      if (property.PropertyObj.NAME === props.propertyName) {
        mortgageAmount = property.PropertyObj.UNMORTGAGE_PRICE
        if (props.cash > mortgageAmount) {
          property.Mortgaged = false
          props.dispatch(setUserProperties(tempProperties, props.playerIndex))
          props.reduceFunds(mortgageAmount)
        } else {
          console.log('not Enough money')
        }
      }
    })
  }
  return (
    <button onClick={() => { unmortgageProperty() }}>UnMortgage</button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex
  }
}

UnMortgage.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  propertyName: React.PropTypes.string.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  reduceFunds: React.PropTypes.func.isRequired,
  cash: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(UnMortgage)
