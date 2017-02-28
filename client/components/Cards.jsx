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
  setEndTurn
} from './store/actionCreators'
const Cards = (props) => {
  const handleClick = () => {
    console.log('in cards.jsx cards function has been invoked!!!')
    let numberOfCards = 16
    let cardID = Math.floor((numberOfCards * Math.random()))
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
      // props.dispatch(setUserPositions(card.Position, props.index))
      // props.dice(card.Position, props.index, true)
      // console.log('in cards.jsx userPosArray = ', props.userPosArray)
      // todo check for passing GO
    } else if (card.Cash) {
      console.log('card.Cash = ', card.Cash)
      props.dispatch(setCash(card.Cash, props.index))
      let newComment = card.Description
      props.setState({comment: newComment, showToast: true})
      sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
      props.dispatch(setEndTurn(!props.doubles))
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
        props.dispatch(setUserPositions(pos, props.index))
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
        console.log('in cards.jsx card.special = ', card.special)
        let newComment = card.Description
        props.setState({comment: newComment, showToast: true})
        sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
        let pos = 0
        if (props.userPosArray[props.index] === 7) {
          pos = 4
        } else if (props.userPosArray[props.index] === 22) {
          pos = 19
        } else if (props.userPosArray[props.index] === 36){
          pos = 33
        }
        props.dispatch(setUserPositions(pos, props.index))
        props.dice(pos, props.index, true)
        props.dispatch(setEndTurn(!props.doubles))
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
        props.dispatch(setUserPositions(pos, props.index))
        props.dice(card.Position, props.index, true)
        props.dispatch(setEndTurn(!props.doubles))
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
          pos = 15
        } else if (props.userPosArray[props.index] === 22) {
          pos = 25
        } else if (props.userPosArray[props.index] === 36) {
          pos = 5
        }
        props.dispatch(setUserPositions(pos, props.index))
        props.dice(pos, props.index, true)
        props.dispatch(setEndTurn(!props.doubles))
      }
    } else if (card.House) {
      console.log('in cards.jsx card.description = ', card.Description)
      let amountOwed = 0
      userPropArray = [...props.userPropertiesArray[props.index]]
      userPropArray.forEach((prop) => {
        if (prop.Houses === 5) {
          amountOwed += 115
        } else {
          amountOwed += prop.Houses * 40
        }
      })
      console.log('houses & hotels amount owed = ', amountOwed)
      props.dispatch(setCash(-amountOwed, props.index))
      let newComment = card.Description + `${props.username} paid $${amountOwed}`
      props.setState({comment: newComment, showToast: true})
      sock.socket.emit('comment', {gameID: props.gameID, comment: newComment})
      props.dispatch(setEndTurn(!props.doubles))
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
    userPropertiesArray: state.userPropertiesArray,
    doubles: state.doubles
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
  userPropertiesArray: React.PropTypes.array.isRequired,
  setState: React.PropTypes.func.isRequired,
  button: React.PropTypes.func.isRequired,
  number: React.PropTypes.number.isRequired,
  doubles: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(Cards)
