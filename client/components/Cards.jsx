import React from 'react'
import rules from '../static/rules'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { setUserPositions, setUserMoney } from './store/actionCreators'
const Cards = (props) => {
  const handleClick = () => {
    let numberOfCards = 16
    let cardID = Math.floor((numberOfCards * Math.random()))
    let card = props.card ? rules.Community_Chest[cardID] : rules.Chance[cardID]
    if (card.Position) {
      props.dispatch(setUserPositions(card.Position, props.index))
      // todo check for passing GO
    } else if (card.Cash) {
      props.dispatch(setUserMoney(props.userMoneyArray[props.index] + card.Cash, props.index))
    } else if (card.Special) {
      if (card.Special === 'COLLECT_50_EVERYONE') {
        // let pos = 0
        // if (props.userPosArray(props.index) === 7) {
        //   pos = 15
        // } else if (props.userPosArray(props.index) === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
      } else if (card.Special === 'JAIL') {
        // let pos = 0
        // if (props.userPosArray(props.index) === 7) {
        //   pos = 15
        // } else if (props.userPosArray(props.index) === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
      } else if (card.Special === 'JAIL_FREE') {
        // let pos = 0
        // if (props.userPosArray(props.index) === 7) {
        //   pos = 15
        // } else if (props.userPosArray(props.index) === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
      } else if (card.Special === 'POSITION_3') {
        // let pos = 0
        // if (props.userPosArray(props.index) === 7) {
        //   pos = 15
        // } else if (props.userPosArray(props.index) === 22) {
        //   pos = 25
        // } else {
        //   pos = 5
        // }
        // props.dispatch(setUserPositions(pos, props.index))
      } else if (card.Special === 'UTILITY') {
        let pos = 0
        if (props.userPosArray(props.index) === 7) {
          pos = 15
        } else if (props.userPosArray(props.index) === 22) {
          pos = 25
        } else {
          pos = 5
        }
        // Todo make user roll dice and pay owner money
        props.dispatch(setUserPositions(pos, props.index))
      }
      // props.dispatch(setUserPositions(pos, props.index))
    } else if (card.Special === 'PAY_50_EVERYONE') {
      // let pos = 0
      // if (props.userPosArray(props.index) === 7) {
      //   pos = 15
      // } else if (props.userPosArray(props.index) === 22) {
      //   pos = 25
      // } else {
      //   pos = 5
      // }
      // props.dispatch(setUserPositions(pos, props.index))
    } else if (card.Special === 'RAILROAD') {
      //  let pos = 0
      //  if (props.userPosArray(props.index) === 7) {
      //    pos = 15
      //  } else if (props.userPosArray(props.index) === 22) {
      //    pos = 25
      //  } else {
      //    pos = 5
      //  }
      // Todo make user roll dice and pay owner money
      //  props.dispatch(setUserPositions(pos, props.index))
    }
    props.button()
  }
  return (
    <Button secondary fluid onClick={handleClick}>  Pick a {props.card ? 'Community Chest' : 'Chance'} Card! </Button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPosArray: state.userPosArray,
    index: state.index,
    userMoneyArray: state.userMoneyArray
  }
}

Cards.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userMoneyArray: React.PropTypes.array.isRequired,
  card: React.PropTypes.bool.isRequired,
  button: React.PropTypes.func.isRequired,
  number: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(Cards)
