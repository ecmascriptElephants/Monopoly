import React from 'react'
import sock from '../helper/socket'
import rules from '../static/rules'
import { connect } from 'react-redux'
import {
  setUserPositions,
  setMoveToken,
  setDiceRoll,
  setCardButton,
  setEndTurn,
  setLuxury,
  setGoButton,
  setJailPostions,
  setBuyProperty
} from '../components/store/actionCreators'
import { Button } from 'semantic-ui-react'
const MoveToken = (props) => {
  // let jail = false
  const handleMoveToken = () => {
    const doubles = props.doubles
    const diceSum = props.diceSum
    // let oldUserPosition = props.userPosArray[props.index]
    let userPosition = (props.userPosArray[props.index] + diceSum) % 40
    props.dispatch(setUserPositions(userPosition, props.index))
    props.dice(userPosition, props.index, true)
    let squareType = rules.PositionType[userPosition]
    if (squareType === 'GO_TO_JAIL' || doubles === 3) {
      // jail = true
      props.dispatch(setUserPositions(10, props.index))
      props.dice(10, props.index, true)
      props.dispatch(setMoveToken(false))
      props.dispatch(setEndTurn(true))
      props.dispatch(setJailPostions(this.props.index, 1))
    } else if (squareType === 'CHANCE') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
        // card: false setup so,ething for chance card
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on a chance space.`)
    } else if (squareType === 'COMMUNITY_CHEST') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
       // card: false setup so,ething for chance card
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on a community chest space.`)
    } else if (squareType === 'GO_TO_JAIL' || doubles === 3) {
      // jail = true
      props.dispatch(setUserPositions(10, props.index))
      props.dispatch(setMoveToken(false))
      props.dispatch(setEndTurn(true))
    } else if (squareType === 'PROPERTY') {
      if (this.propertyIsOwned(userPosition) === false) {
        let cost = 0
        let propertyName = ''
        rules.Properties.forEach(prop => {
          if (prop.BOARD_POSITION === userPosition) {
            cost = prop.PRICE
            propertyName = prop.NAME
          }
        })
        props.dispatch(setMoveToken(false))
        props.dispatch(setBuyProperty(true))
        props.setState({
          buyPropertyButtonVisible: true,
          moveTokenButtonVisible: false,
          comment: `You landed on ${propertyName}, and can buy it for $${cost}.`,
          endTurnButtonVisible: true
        })
        sock.socket.emit('comment', `${props.userNames[props.index]} landed on an unowned property!`)
        if (doubles) {
          props.setState({
            endTurnButtonVisible: false,

            diceRollButtonVisible: true
          })
        }
      } else {
        let propertyOwner = this.propertyIsOwned(userPosition)
        let rentOwed = 0
        let propName = ''
        let mortgagedFlag = false
        props.userPropertiesArray[propertyOwner].forEach(prop => {
          if (prop.Position === userPosition) {
            propName = prop.PropertyObj.NAME
            if (prop.Mortgaged) {
              mortgagedFlag = true
            } else if (prop.PropertyObj.PROPERTY_GROUP === 'Utilities') {
              let utilityCount = -1
              props.userPropertiesArray[propertyOwner].forEach(prop => {
                if (prop.PropertyObj.PROPERTY_GROUP === 'Utilities') {
                  utilityCount += 1
                }
              })
              rentOwed = (diceSum) * (prop.PropertyObj.RENT[utilityCount])
            } else if (prop.PropertyObj.PROPERTY_GROUP === 'Stations') {
              let stationCount = -1
              props.userPropertiesArray[propertyOwner].forEach(prop => {
                if (prop.PropertyObj.PROPERTY_GROUP === 'Stations') {
                  stationCount += 1
                }
              })
              rentOwed = prop.PropertyObj.RENT[stationCount]
            } else {
              rentOwed = prop.PropertyObj.RENT[prop.Houses]
            }
          }
        })
        props.setState({
          payRentButtonVisible: true,
          comment: `You landed on ${propName}. Pay ${rentOwed} to ${props.userNames[propertyOwner]}.`,
          endTurnButtonVisible: false,
          moveTokenButtonVisible: false,
          rentOwed: rentOwed,
          propertyOwner: propertyOwner
        })
        sock.socket.emit('comment', `${props.userNames[props.index]} landed on ${propName}. Pay $${rentOwed} to ${props.userNames[propertyOwner]}.`)
        if (propertyOwner === props.index) {
          props.setState({
            payRentButtonVisible: false,
            comment: `You landed on ${propName}, but you already own it.`,
            endTurnButtonVisible: !doubles,
            diceRollButtonVisible: !!doubles,
            moveTokenButtonVisible: false,
            rentOwed: rentOwed,

            propertyOwner: propertyOwner
          })
        } else if (mortgagedFlag) {
          props.setState({
            payRentButtonVisible: false,
            comment: `You landed on ${propName}, but it is mortgaged.`,
            endTurnButtonVisible: !doubles,
            diceRollButtonVisible: !!doubles,
            moveTokenButtonVisible: false,
            rentOwed: rentOwed,

            propertyOwner: propertyOwner
          })
        } else {
          props.setState({
            payRentButtonVisible: true,
            comment: `You landed on ${propName}. Pay ${rentOwed} to ${props.userNames[propertyOwner]}.`,
            endTurnButtonVisible: false,
            moveTokenButtonVisible: false,

            rentOwed: rentOwed,
            propertyOwner: propertyOwner
          })
        }
      }
    } else if (squareType === 'GO') {
      props.setState({
        comment: 'You landed on GO. Collect $200!',

        goButtonVisible: true,
        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on GO. Collect $200!`)
      if (!doubles) {
        props.setState({
          endTurnButtonVisible: true,
          diceRollButtonVisible: false
        })
      }
      if (doubles) {
        props.setState({
          diceRollButtonVisible: true,
          endTurnButtonVisible: false
        })
      }
    } else if (squareType === 'FREE_PARKING') {
      props.setState({
        comment: 'You landed on Free Parking. Nothing happens.',

        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on Free Parking. Nothing happens.`)
      if (!doubles) {
        props.setState({
          endTurnButtonVisible: true,
          comment: ''
        })
      }
      if (doubles) {
        props.setState({

          diceRollButtonVisible: true
        })
      }
    } else if (squareType === 'JAIL') {
      props.setState({
        comment: 'You landed on Jail, but you are just visiting.',

        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on Jail. But ${props.userNames[props.index]} is just visiting.`)
      if (!doubles) {
        props.setState({

          endTurnButtonVisible: true
        })
      }
      if (doubles) {
        props.setState({

          diceRollButtonVisible: true
        })
      }
    } else if (squareType === 'INCOME_TAX') {
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on Income Tax. Pay $200.`)
      props.setState({
        moveTokenButtonVisible: false,
        endTurnButtonVisible: false,

        incomeTaxButtonVisible: true,
        comment: 'You landed on Income Tax. Pay $200.',
        userPositions: userPosition
      })
    } else if (squareType === 'LUXURY_TAX') {
      props.setState({
        moveTokenButtonVisible: false,
        endTurnButtonVisible: false,

        luxuryTaxButtonVisible: true,
        comment: 'You landed on Luxury Tax. Pay $100.',
        userPositions: userPosition
      })
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on Luxury Tax. Pay $100.`)
    }
    // this.handleLandOnOrPassGo(oldUserPosition, userPosition, jail)
  }

  return (
    <Button secondary fluid onClick={() => { handleMoveToken() }}>  Move Your Token! </Button>
  )
}
const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    userPosArray: state.userPosArray,
    userPropertiesArray: state.userPropertiesArray,
    jailPositions: state.jailPositions,
    index: state.index,
    userCashArray: state.userCashArray,
    diceRollButton: state.diceRollButton,
    moveTokenButton: state.moveTokenButton,
    cardButton: state.cardButton,
    setGoButton: state.setGoButton,
    endTurnButton: state.endTurnButton,
    incomeTaxButton: state.incomeTaxButton,
    luxuryButton: state.luxuryButton,
    payRent: state.payRent,
    bankruptcyButton: state.bankruptcyButton,
    payFineButton: state.payFineButton,
    jailRollDiceButton: state.jailRollDiceButton,
    buyPropertyButton: state.buyPropertyButton,
    freeCardButton: state.freeCardButton
  }
}
MoveToken.propTypes = {
  dice: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  jailPositions: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  setState: React.PropTypes.func.isRequired,
  doubles: React.PropTypes.number.isRequired,
  userNames: React.PropTypes.array.isRequired,
  diceSum: React.PropTypes.number.isRequired,
  diceRollButton: React.PropTypes.bool.isRequired,
  moveTokenButton: React.PropTypes.bool.isRequired,
  cardButton: React.PropTypes.bool.isRequired,
  setGoButton: React.PropTypes.bool.isRequired,
  endTurnButton: React.PropTypes.bool.isRequired,
  incomeTaxButton: React.PropTypes.bool.isRequired,
  luxuryButton: React.PropTypes.bool.isRequired,
  payRent: React.PropTypes.bool.isRequired,
  bankruptcyButton: React.PropTypes.bool.isRequired,
  payFineButton: React.PropTypes.bool.isRequired,
  jailRollDiceButton: React.PropTypes.bool.isRequired,
  freeCardButton: React.PropTypes.bool.isRequired,
  buyPropertyButton: React.PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(MoveToken)
