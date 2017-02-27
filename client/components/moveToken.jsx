import React from 'react'
import sock from '../helper/socket'
import rules from '../static/rules'
import { connect } from 'react-redux'
import comments from '../helper/comment'
import {
  setUserPositions,
  setMoveToken,
  setDiceRoll,
  setCardButton,
  setEndTurn,
  setLuxury,
  setGoButton,
  setJailPostions,
  setBuyProperty,
  setPayRent,
  setIncomeTax
} from '../components/store/actionCreators'
import { Button } from 'semantic-ui-react'
const MoveToken = (props) => {
  const propertyIsOwned = (propertyPosition) => {
    let ownerNumber = false
    props.userPropertiesArray.forEach((propertyArray, index) => {
      propertyArray.forEach((propertyObj) => {
        if (propertyObj.Position === propertyPosition) ownerNumber = index
      })
    })
    return ownerNumber
  }

  const handleLandOnOrPassGo = (oldUserPosition, userPosition, jail) => {
    if (!jail && userPosition < oldUserPosition) {
      let goComment = 'You passed GO. Collect $200.'
      const doubles = this.state.doubles
      this.props.dispatch(setEndTurn(!doubles))
      this.props.dispatch(setGoButton(true))
      this.props.dispatch(setDiceRoll(!!doubles))
    }
  }

  const handleMoveToken = () => {
    const doubles = props.doubles
    const diceSum = props.diceSum
    let jail = false
    let oldUserPosition = props.userPosArray[props.index]
    let userPosition = (props.userPosArray[props.index] + diceSum) % 40
    props.dispatch(setUserPositions(userPosition, props.index))
    props.dice(userPosition, props.index, true)
    let squareType = rules.PositionType[userPosition]
    if (squareType === 'GO_TO_JAIL' || doubles === 3) {
      jail = true
      props.dispatch(setUserPositions(10, props.index))
      props.dice(10, props.index, true)
      props.dispatch(setMoveToken(false))
      props.dispatch(setEndTurn(true))
      props.dispatch(setJailPostions(this.props.index, 1))
    } else if (squareType === 'CHANCE') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
      props.setState({card: false})
      const send = comments.chance(props.username)
      sock.comment(props.gameID, send)
    } else if (squareType === 'COMMUNITY_CHEST') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
      props.setState({card: true})
      const send = comments.community(props.username)
      sock.comment(props.gameID, send)
    } else if (squareType === 'PROPERTY') {
      if (propertyIsOwned(userPosition) === false) {
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
        props.dispatch(setEndTurn(!doubles))
        props.dispatch(setDiceRoll(!!doubles))
        const send = comments.unowned(props.username)
        sock.comment(props.gameID, send)
      } else {
        let propertyOwner = propertyIsOwned(userPosition)
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
        const send = comments.owned(props.username, propName, rentOwed, props.userNames[propertyOwner])
        sock.comment(props.gameID, send)
        if (propertyOwner === props.index || mortgagedFlag) {
          props.dispatch(setMoveToken(false))
          props.dispatch(setEndTurn(!doubles))
          props.dispatch(setDiceRoll(!!doubles))
          props.dispatch(setPayRent(false))
        } else {
          props.dispatch(setMoveToken(false))
          props.dispatch(setPayRent(true))
          const comment = comments.rentOwned(propName, rentOwed, props.userNames[propertyOwner] )
          props.setState({
            comment,
            rentOwed,
            propertyOwner,
            showToast: true
          })
        }
      }
    } else if (squareType === 'GO') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setGoButton(true))
      const comment = comments.landOnGo()
      props.setState({
        comment,
        showToast: true
      })
      sock.socket.emit('comment', `${props.userNames[props.index]} landed on GO. Collect $200!`)
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'FREE_PARKING') {
      props.dispatch(setMoveToken(false))
      const comment = comments.freeParking()
      props.setState({
        comment,
        showToast: true
      })
      sock.comment(props.gameID, `${props.username} landed on Free Parking. Nothing happens.`)
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'JAIL') {
      props.dispatch(setMoveToken(false))
      const comment = comments.jailLand()
      props.setState({
        comment,
        showToast: true
      })
      sock.comment(props.gameID, `${props.username} landed on Jail. But ${props.userNames[props.index]} is just visiting.`)
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'INCOME_TAX') {
      sock.socket.emit('comment', `${props.username} landed on Income Tax. Pay $200.`)
      props.dispatch(setMoveToken(false))
      props.dispatch(setIncomeTax(true))
      const comment = comments.incomeTax()
      props.setState({
        comment,
        showToast: true
      })
    } else if (squareType === 'LUXURY_TAX') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setLuxury(true))
      const comment = comments.LuxuryTab
      props.setState({
        comment,
        showToast: true
      })
      sock.comment(props.gameID, `${props.username} landed on Luxury Tax.`)
    }
    handleLandOnOrPassGo(oldUserPosition, userPosition, jail)
  }

  return (
    <Button secondary fluid onClick={() => { handleMoveToken() }}>  Move Your Token! </Button>
  )
}
const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userPosArray: state.userPosArray,
    userPropertiesArray: state.userPropertiesArray,
    jailPositions: state.jailPositions,
    index: state.index,
    userCashArray: state.userCashArray
  }
}

MoveToken.propTypes = {
  dice: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  jailPositions: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  setState: React.PropTypes.func.isRequired,
  doubles: React.PropTypes.number.isRequired,
  userNames: React.PropTypes.array.isRequired,
  diceSum: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(MoveToken)
