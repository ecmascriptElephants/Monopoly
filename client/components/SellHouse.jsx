import React from 'react'
import { connect } from 'react-redux'
import { setUserProperties } from './store/actionCreators'

const SellHouse = (props) => {
  const sellHouse = (propertyPosition) => {
    let propertiesArray = this.state.property
    let houseSalePrice = 0
    propertiesArray.forEach((property) => {
      if (property.Position === propertyPosition && property.Houses > 0) {
        houseSalePrice = property.PropertyObj.HOUSE_SALE_PRICE
        property.Houses -= 1
      }
    })
    this.increaseFunds(houseSalePrice)
    props.dispatch(setUserProperties(propertiesArray, props.playIndex))
  }

  return (
    <button onClick={() => { sellHouse(props.propertyPosition) }}>Sell House</button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex
  }
}

SellHouse.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  propertyPosition: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  IncreaseFunds: React.PropTypes.func.isRequired,
  propertyGroup: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(SellHouse)
