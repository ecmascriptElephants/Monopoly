import React from 'react'
import rules from '../static/rules'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { setUserPositions, setCash } from './store/actionCreators'
const Cards = (props) => {
  const handleClick = () => {
    let numberOfCards = 16
    let cardID = Math.floor((numberOfCards * Math.random()))
    let card = props.card ? rules.Community_Chest[cardID] : rules.Chance[cardID]
    if (card.Position) {
      props.dispatch(setUserPositions(card.Position, props.index))
      console.log('in cards.jsx', props.userPosArray)
    } else if (card.Cash) {
      props.dispatch(setCash(card.Cash, props.index))
    } else if (card.Special) {
      if (card.Special === 'UTILITY') {
        let pos = 0
        if (props.userPosArray(props.index) === 7) {
          pos = 15
        } else if (props.userPosArray(props.index) === 22) {
          pos = 25
        } else {
          pos = 5
        }
        props.dispatch(setUserPositions(pos, props.index))
      } else if (card.Special === 'PAY EVERYONE') {
        props.dispatch(setCash(-50, props.index))
        for (let i = 0; i < props.number; i++) {
          if (i !== props.index) {
            props.dispatch(setCash(50, i))
          }
        }
      } else if (card.Special === 'EVERYONE') {
        props.dispatch(setCash(50 * props.number, props.index))
      }
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
  userCashArray: React.PropTypes.array.isRequired,
  card: React.PropTypes.bool.isRequired,
  button: React.PropTypes.func.isRequired,
  number: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Cards)
