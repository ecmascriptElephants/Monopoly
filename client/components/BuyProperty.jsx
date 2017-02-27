import React from 'react'
import sock from '../helper/socket'
import rules from '../static/rules'
import { connect } from 'react-redux'
import {
  setDiceRoll,
  setEndTurn,
  setBuyProperty,
  setUserProperties,
  setCash
} from '../components/store/actionCreators'
import { Button } from 'semantic-ui-react'
import comments from '../helper/comment'
import Bankrupt from './Bankrupt'

const BuyProperty = (props) => {
  const handleBuyPropertyButtonClick = () => {
    let propertyPosition = props.userPosArray[props.index]
    let propertiesArray = [...props.userPropertiesArray[props.playerIndex]]
    let propertyPrice = 0
    let newProperty = { PropertyObj: {}, Mortgaged: false, Houses: 0, Position: propertyPosition }
    rules.Properties.forEach((property) => {
      if (property.BOARD_POSITION === propertyPosition) {
        propertyPrice = property.PRICE
        newProperty.PropertyObj = property
        propertiesArray.push(newProperty)
      }
    })

    if (props.userCashArray[props.index] < propertyPrice) {
      props.dispatch(setEndTurn(!props.doubles))
      props.dispatch(setBuyProperty(false))
      props.dispatch(setDiceRoll(!!props.doubles))
      const comment = comments.LowCash()
      props.setState({
        comment,
        showToast: true
      })
      checkBankruptcy()
    } else {
      props.dispatch(setCash(-propertyPrice, props.index))
      sock.updateMoney({ gameID: props.gameID, money: -propertyPrice, index: props.index })
      props.dispatch(setUserProperties(propertiesArray, props.index))
      console.log(props.userPropertiesArray)
      props.dispatch(setEndTurn(!props.doubles))
      props.dispatch(setBuyProperty(false))
      props.dispatch(setDiceRoll(!!props.doubles))
      const comment = comments.propertyBought(newProperty.PropertyObj.NAME, newProperty.PropertyObj.PRICE)
      props.setState({
        comment,
        showToast: true
      })
      sock.updateProps({ gameID: props.gameID, properties: propertiesArray, index: props.index })
      const send = comments.boughtBySomeone(props.username, newProperty.PropertyObj.NAME)
      sock.comment(props.gameID, send)
    }
  }

  return (
    <Button secondary fluid onClick={() => { handleBuyPropertyButtonClick() }}>  Buy This Property. </Button>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userPosArray: state.userPosArray,
    userPropertiesArray: state.userPropertiesArray,
    index: state.index,
    userCashArray: state.userCashArray,
    playerIndex: state.playerIndex
  }
}

BuyProperty.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  setState: React.PropTypes.func.isRequired,
  doubles: React.PropTypes.number.isRequired,
  userNames: React.PropTypes.array.isRequired,
  diceSum: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(BuyProperty)
