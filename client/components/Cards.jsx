import React from 'react'
import rules from '../static/rules'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import sock from '../helper/socket'
import comments from '../helper/comment'
import {
  setUserPositions,
  setCash,
  setUserJail,
  setMoveToken,
  setEndTurn,
  setDiceRoll
} from './store/actionCreators'
const Cards = (props) => {
  const handleClick = () => {
    console.log('in cards.jsx cards function has been invoked!!!')
    let numberOfCards = 16
    // let cardID = Math.floor((numberOfCards * Math.random()))
    let cardID = 8
    let card = props.card ? rules.Community_Chest[cardID] : rules.Chance[cardID]
    console.log('in cards.jsx card description = ', card.Description)
    if (card.Position !== undefined) {
      console.log('in cards.jsx card position = ', card.Position)
      let newComment = card.Description
      props.setState({comment: newComment, showToast: true})
      sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
      let diceSum = 0
      if (card.Position - props.userPosArray[props.index] < 0) {
        diceSum = 40 + card.Position - props.userPosArray[props.index]
      } else {
        diceSum = card.Position - props.userPosArray[props.index]
      }
      props.setState({diceSum: diceSum})
      props.dispatch(setMoveToken(true))
      props.dispatch(setEndTurn(false))
    if (card.Position) {
      props.dispatch(setUserPositions(card.Position, props.index))
      // todo check for passing GO
    } else if (card.Cash) {
      console.log('card.Cash = ', card.Cash)
      props.dispatch(setCash(card.Cash, props.index))
      let newComment = card.Description
      props.setState({comment: newComment, showToast: true})
      sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
      props.dispatch(setEndTurn(!props.doubles))
      props.dispatch(setDiceRoll(props.doubles))
      sock.updateMoney({gameID: props.gameID, money: card.Cash, index: props.index})
    } else if (card.Special) {
      if (card.Special === 'COLLECT_50_EVERYONE') {
        // let pos = 0
        // if (props.userPosArray[props.index] === 7) {
        //   pos = 15
        // } else if (props.userPosArray[props.index] === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
        props.dispatch(setEndTurn(!props.doubles))

      } else if (card.Special === 'JAIL') {
        let newComment = card.Description
        props.setState({comment: newComment, showToast: true})
        sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
        props.dispatch(setUserPositions(10, props.index))
        props.dice(10, props.index, true)
        props.dispatch(setUserJail(1, props.index))
        props.dispatch(setEndTurn(true))
      } else if (card.Special === 'JAIL_FREE') {
        // let pos = 0
        // if (props.userPosArray[props.index] === 7) {
        //   pos = 15
        // } else if (props.userPosArray[props.index] === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
        props.dispatch(setEndTurn(!props.doubles))
      } else if (card.Special === 'POSITION_3') {
        console.log('in cards.jsx card.special = ', card.Special)
        let newComment = card.Description
        props.setState({comment: newComment, showToast: true})
        sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
        let diceSum = -3
        props.setState({diceSum: diceSum, goFlag: true})
        props.dispatch(setMoveToken(true))
        props.dispatch(setEndTurn(false))
      } else if (card.Special === 'UTILITY') {
        console.log('in cards.jsx card.special = ', card.special)
        let newComment = card.Description
        props.setState({comment: newComment, showToast: true})
        sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
        let pos = 0
        if (props.userPosArray[props.index] === 7) {
          pos = 12

        } else if (props.userPosArray[props.index] === 22) {
          pos = 28
        } else if (props.userPosArray[props.index] === 36){
          pos = 28
        }

        let diceSum = 0
        if (card.Position - props.userPosArray[props.index] < 0) {
          diceSum = 40 + pos - props.userPosArray[props.index]
        } else {
          diceSum = pos - props.userPosArray[props.index]
        }
        props.setState({diceSum: diceSum, specialRollDice})
        props.dispatch(setMoveToken(true))
        props.dispatch(setEndTurn(false))

      } else if (card.Special === 'PAY_50_EVERYONE') {
        // let pos = 0
        // if (props.userPosArray[props.index] === 7) {
        //   pos = 15
        // } else if (props.userPosArray[props.index] === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
        props.dispatch(setEndTurn(!props.doubles))
      } else if (card.Special === 'RAILROAD') {
        console.log('in cards.jsx card.special = ', card.special)
        let newComment = card.Description
        props.setState({comment: newComment, showToast: true})
        sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
        let pos = 0
        if (props.userPosArray[props.index] === 7) {
          pos = 5
        } else if (props.userPosArray[props.index] === 22) {
          pos = 25
        } else if (props.userPosArray[props.index] === 36) {
          pos = 35
        }
        let diceSum = 0
        if (pos - props.userPosArray[props.index] < 0) {
          diceSum = 40 + pos - props.userPosArray[props.index]
        } else {
          diceSum = pos - props.userPosArray[props.index]
        }
        props.setState({diceSum: diceSum, doubleRailRoadRentMultiplier: true})
        props.dispatch(setMoveToken(true))
        props.dispatch(setEndTurn(false))
      }
    } else if (card.House) {
      console.log('in cards.jsx card.description = ', card.Description)
      let amountOwed = 0
      let userPropArray = [...props.userPropertiesArray[props.index]]
      userPropArray.forEach((prop) => {
        if (prop.Houses === 5) {
          amountOwed += card.Hotel
        } else {
          amountOwed += prop.Houses * card.House
        }
      })
      console.log('houses & hotels amount owed = ', amountOwed)
      props.dispatch(setCash(amountOwed, props.index))
      let newComment = card.Description
      props.setState({comment: newComment, showToast: true})
      sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
      props.dispatch(setEndTurn(!props.doubles))
      props.dispatch(setDiceRoll(props.doubles))
      sock.updateMoney({gameID: props.gameID, money: card.Cash, index: props.index})
    }
    props.button()
  }
  return (
    <Button secondary fluid onClick={handleClick}>  Pick a {props.card ? 'Community Chest' : 'Chance'} Card! </Button>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userPosArray: state.userPosArray,
    index: state.index,
    jailPositions: state.jailPositions,
    userCashArray: state.userCashArray,
    userPropertiesArray: state.userPropertiesArray
  }
}

Cards.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  dice: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  jailPositions: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  card: React.PropTypes.bool.isRequired,
  goFlag: React.PropTypes.bool.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  setState: React.PropTypes.func.isRequired,
  button: React.PropTypes.func.isRequired,
  number: React.PropTypes.number.isRequired,
  doubleRailRoadRentMultiplier: React.PropTypes.bool.isRequired,
  doubles: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(Cards)
