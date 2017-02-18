import React from 'react'
import rules from '../static/rules'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { setUserPositions, setCash } from './store/actionCreators'
const Cards = (props) => {
  const handleClick = () => {
    let numberOfCards = 16
    let cardID = Math.floor((numberOfCards * Math.random()))
    let card = rules.Community_Chest[cardID]
    if (card.Position) {
      props.dispatch(setUserPositions(card.Position, props.index))
      console.log('in cards.jsx', props.userPosArray)
    } else if (card.Cash) {
      props.dispatch(setCash(card.Cash, props.index))
    } else if (card.Special) {

    }
  }
  return (
    <Button secondary fluid onClick={handleClick}>  Pick a Chance Card! </Button>
  )
}

const mapStateToProps = (state) => {
  return {
    userPosArray: state.userPosArray,
    index: state.index,
    userCashArray: state.userCashArray
  }
}

Cards.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userCashArray: React.PropTypes.array.isRequired
}
export default connect(mapStateToProps)(Cards)
