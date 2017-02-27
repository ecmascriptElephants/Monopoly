import React from 'react'
import { connect } from 'react-redux'
import { setUserProperties } from './store/actionCreators'

const BuyHouse = (props) => {
  const buyHouse = (propertyPosition) => {
    if (props.houses < 5) {
      let propertiesArray = [...props.userPropertiesArray[props.playerIndex]]
      let housePrice = 0
      let propertiesInGroupCount = propertiesArray.reduce((numberOfPropertiesInGroup, property) => {
        if (property.PropertyObj.PROPERTY_GROUP === props.propertyGroup) {
          numberOfPropertiesInGroup += 1
          return numberOfPropertiesInGroup
        }
      }, 0)

      if (props.numberNeeded === propertiesInGroupCount) {
        propertiesArray.forEach((property) => {
          if (property.Position === propertyPosition && property.PropertyObj.ALLOWS_HOUSES) {
            housePrice = property.PropertyObj.HOUSE_PRICE
            if (props.userCashArray[props.playerIndex] >= housePrice) {
              property.Houses += 1
              props.reduceFunds(housePrice)
              console.log(propertiesArray)
              props.dispatch(setUserProperties(propertiesArray, props.index))
            }
          }
        })
        if (props.userCashArray[props.playerIndex] < housePrice) {
          console.log('You do not have sufficient funds to purchase additional houses')
        }
      } else {
        console.log(`You need ${props.numberNeeded} properties in order to have a monopoly, but you only have ${propertiesInGroupCount}.`)
      }
    } else {
      console.log('You can not buy any more houses')
    }
  }
  return (
    <button onClick={() => { buyHouse(props.propertyPosition) }}>Buy House</button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPropertiesArray: state.userPropertiesArray,
    playerIndex: state.playerIndex,
    userCashArray: state.userCashArray
  }
}

BuyHouse.propTypes = {
  userPropertiesArray: React.PropTypes.array.isRequired,
  propertyPosition: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  reduceFunds: React.PropTypes.func.isRequired,
  propertyGroup: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(BuyHouse)
