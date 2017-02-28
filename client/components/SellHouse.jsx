import React from 'react'
import { connect } from 'react-redux'
import { setUserProperties } from './store/actionCreators'

const SellHouse = (props) => {
  const sellHouse = (propertyPosition) => {
    let propertiesArray = [...props.userPropertiesArray[props.playerIndex]]
    let houseSalePrice = 0
    propertiesArray.forEach((property) => {
      if (property.Position === propertyPosition && property.Houses > 0) {
        houseSalePrice = property.PropertyObj.HOUSE_SALE_PRICE
        property.Houses -= 1
        props.increaseFunds(houseSalePrice)
        props.dispatch(setUserProperties(propertiesArray, props.playIndex))
      }
    })
  }

  return (
    <button onClick={() => { sellHouse(props.propertyPosition) }}>Sell House</button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex,
    gameID: state.gameID,
    username: state.username,
    userCashArray: state.userCashArray
  }
}

SellHouse.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  propertyPosition: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  setState: React.PropTypes.func.isRequired,
  increaseFunds: React.PropTypes.func.isRequired
}
export default connect(mapStateToProps)(SellHouse)
