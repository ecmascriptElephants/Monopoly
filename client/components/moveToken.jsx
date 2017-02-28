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
<<<<<<< HEAD
=======
  setUserJail,
>>>>>>> cardsBranch2
  setBuyProperty,
  setPayRent,
  setIncomeTax,
  setUserJail
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
      if (userPosition !== 0) {
        let newComment = comments.passGo(props.username)
        props.setState({ comment: newComment, showToast: true })
        sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      }
      const doubles = props.doubles
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setGoButton(true))
      props.dispatch(setDiceRoll(!!doubles))
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
<<<<<<< HEAD
      props.dispatch(setJailPostions(props.index, 1))
=======
      props.dispatch(setUserJail(props.index, 1))
>>>>>>> cardsBranch2
      if (doubles === 3) {
        let newComment = comments.tripleDoubles(props.username)
        props.setState({ comment: newComment, showToast: true })
        sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      } else {
        let newComment = comments.squareTypeGoToJail(props.username)
        props.setState({ comment: newComment, showToast: true })
        sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      }
    } else if (squareType === 'CHANCE') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
      props.setState({card: false})
      let newComment = comments.squareTypeChance(props.username)
      props.setState({ comment: newComment, showToast: true })
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
    } else if (squareType === 'COMMUNITY_CHEST') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setCardButton(true))
      props.setState({card: true})
      let newComment = comments.squareTypeCommunityChest(props.username)
      props.setState({ comment: newComment, showToast: true })
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
    } else if (squareType === 'PROPERTY') {
      if (propertyIsOwned(userPosition) === false) {
        props.dispatch(setMoveToken(false))
        props.dispatch(setBuyProperty(true))
        props.dispatch(setEndTurn(!doubles))
        props.dispatch(setDiceRoll(!!doubles))
        let newComment = comments.squareTypeUnownedProperty(props.username, propertyName, cost)
        props.setState({ comment: newComment, showToast: true })
        sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
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
        if (propertyOwner === props.index || mortgagedFlag) {
          props.dispatch(setMoveToken(false))
          props.dispatch(setEndTurn(!doubles))
          props.dispatch(setDiceRoll(!!doubles))
          props.dispatch(setPayRent(false))

          if (propertyOwner === props.index) {
            let newComment = comments.propertyAlreadyOwned(props.username, propertyName, cost)
            props.setState({ comment: newComment, showToast: true })
            sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
          } else {
            let newComment = comments.propertyIsMortgaged(props.username, propertyName, cost)
            props.setState({ comment: newComment, showToast: true })
            sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
          }
        } else {
          props.dispatch(setMoveToken(false))
          props.dispatch(setPayRent(true))
          let newComment = comments.rentOwed(props.username, propName, rentOwed, props.userNames[propertyOwner])
          props.setState({ comment: newComment, showToast: true, rentOwed: rentOwed, propertyOwner: propertyOwner })
          sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
        }
      }
    } else if (squareType === 'GO') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setGoButton(true))
      let newComment = comments.squareTypeGo(props.username)
      props.setState({ comment: newComment, showToast: true })
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'FREE_PARKING') {
      props.dispatch(setMoveToken(false))
      let newComment = comments.squareTypeFreeParking(props.username)
      props.setState({ comment: newComment, showToast: true })
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'JAIL') {
      props.dispatch(setMoveToken(false))
      let newComment = comments.squareTypeJail(props.username)
      props.setState({ comment: newComment, showToast: true})
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      props.dispatch(setEndTurn(!doubles))
      props.dispatch(setDiceRoll(!!doubles))
    } else if (squareType === 'INCOME_TAX') {
      let newComment = comments.squareTypeIncomeTax(props.username)
      props.setState({ comment: newComment, showToast: true})
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
      props.dispatch(setMoveToken(false))
      props.dispatch(setIncomeTax(true))
    } else if (squareType === 'LUXURY_TAX') {
      props.dispatch(setMoveToken(false))
      props.dispatch(setLuxury(true))
      let newComment = comments.squareTypeLuxuryTax(props.username)
      props.setState({ comment: newComment, showToast: true})
      sock.socket.emit('comment', { gameID: props.gameID, comment: newComment })
    }
    handleLandOnOrPassGo(oldUserPosition, userPosition, jail)
    props.setState({ dice: [0, 0]})
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
  diceSum: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(MoveToken)
