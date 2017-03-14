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
import { Button, Image, Modal } from 'semantic-ui-react'
import comments from '../helper/comment'
// import Bankrupt from './Bankrupt'

const BuyProperty = (props) => {
  const close = () => {
    props.dispatch(setBuyProperty(false))
  }

  const checkMonopoly = (propertyGroup, numberNeeded) => {
    const propertiesArray = props.userPropertiesArray[props.playerIndex]
    const indexes = []
    let propertiesInGroupCount = propertiesArray.reduce((numberOfPropertiesInGroup, property, index) => {
      if (property.PropertyObj.PROPERTY_GROUP === propertyGroup) {
        indexes.push(index)
        numberOfPropertiesInGroup += 1
        return numberOfPropertiesInGroup
      }
    }, 0)
    if (propertiesInGroupCount === numberNeeded) {
      for (let i = 0; i < indexes.length; i++) {
        propertiesArray[indexes[i]].Monopoly = true
      }
      props.dispatch(propertiesArray, props.playerIndex)
    }
  }
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
    <Modal open={props.buyPropertyButton} size='small' closeIcon='close' dimmer={false}>
      <Modal.Header> Buy Property </Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' centered src={`Property_Cards/${props.userPosArray[props.index]}.png`} />
      </Modal.Content>
      <Button.Group vertical>
        <Button size='large' color='green' onClick={() => { handleBuyPropertyButtonClick() }}>  Buy This Property. </Button>
        <Button size='large' color='red' onClick={() => { close() }}>  Close </Button>
      </Button.Group>
    </Modal>
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
    playerIndex: state.playerIndex,
    buyPropertyButton: state.buyPropertyButton
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
  diceSum: React.PropTypes.number.isRequired,
  buyPropertyButton: React.PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(BuyProperty)
