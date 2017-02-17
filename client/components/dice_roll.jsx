import React, { Component } from 'react'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUserPositions, setIndex } from './store/actionCreators'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleDoubles = this.handleDoubles.bind(this)
    this.handleAddDiceRollToUserPosition = this.handleAddDiceRollToUserPosition.bind(this)
    this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)
    this.handleEndTurnButtonClick = this.handleEndTurnButtonClick.bind(this)
    this.state = {
      dice: [],
      diceSum: 0,
      diceSumComment: '',
      doubles: 0,
      doublesComment: '',
      currentUser: 0,
      diceRollButtonVisible: false,
      // needs to be updated gamestate authentication
      endTurnButtonVisible: false,
      userNames: [],
      jailPositions: []
    }
  }
  componentDidMount () {
    sock.socket.on('yourTurn', (index) => {
      this.setState({diceRollButtonVisible: true})
      this.props.dispatch(setIndex(index))
      console.log(this.props.index)
    })
  }
  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if (this.props.userPosArray[this.state.index] + die1 + die2 === 30) {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.state.currentUser]} rolled ${die1 + die2}, landing on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass Go. Do Not Collect $200.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        endTurnButtonVisible: true
      })
    } else if (die1 === die2) {
      this.handleDoubles(die1, die2)
      this.setState({
        dice: [die1, die2]
      })
      this.handleAddDiceRollToUserPosition(die1, die2, this.state.doubles)
    } else {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.state.currentUser]} rolled ${die1 + die2}. Move ${die1 + die2} spaces on the board.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        endTurnButtonVisible: true
      })
      this.handleAddDiceRollToUserPosition(die1, die2)
    }
  }

  handleEndTurnButtonClick () {
    this.setState({
      diceRollButtonVisible: false,
      endTurnButtonVisible: false
    })
    sock.end({ gameID: this.props.gameID })
  }

  handleDoubles (die1, die2) {
    if (this.state.doubles === 0) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`
      })
    } else if (this.state.doubles === 1) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`
      })
    } else if (this.state.doubles === 2) {
      let updatedUserPositions = this.state.userPositions
      updatedUserPositions[this.state.currentUser] = 10
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: 0,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles three times in a row. Go to Jail. :(`,
        diceRollButtonVisible: false,
        endTurnButtonVisible: true,
        userPositions: 10
      })
    }
  }

  handleAddDiceRollToUserPosition (die1, die2, doubles) {
    let updatedPosition = (this.props.userPosArray[this.props.index] + die1 + die2) % 40
    this.props.dispatch(setUserPositions(updatedPosition, this.props.index))
    // update the current user to the next user
    // if (updatedCurrentUserPosition === 30) {
    //   updatedCurrentUserPosition = 10
    //   updatedUserPositions[this.state.currentUser] = updatedCurrentUserPosition
    //   updatedJailPositions = this.state.jailPositions
    //   updatedJailPositions[this.state.currentUser] = 1
    //   this.setState({
    //     userPositions: updatedUserPositions,
    //     jailPositions: updatedJailPositions,
    //     doublesComment: 'You landed on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass' +
    //     ' Go. Do Not Collect $200.'
    //   })
    // } else {
    //   // check if the user is landing on or passing go, NOTE still need to deal with jail
    //   this.handleLandOnOrPassGo(oldCurrentUserPosition, updatedCurrentUserPosition)
    //   this.setState({
    //     // currentUser: newCurrentUser,
    //     userPositions: updatedUserPositions
    //   })
    // }
  }

  handleLandOnOrPassGo (oldCurrentUserPosition, updatedCurrentUserPosition, jail) {
    if (!jail) {
      if (updatedCurrentUserPosition < oldCurrentUserPosition) {
        // give the currentUser $200
        this.setState({
        })
      }
    }
  }

  render () {
    return (
      <div className='user-positions_dice-roll_div'>
        <div className='dice-roll_div'>
          <div className='dice'>
            {this.state.diceRollButtonVisible ? `${this.state.userNames[this.state.currentUser]} it is your turn. Roll the dice!` : null}
            <div className='die1'>
              {this.state.dice[0] && this.state.endTurnButtonVisible ? 'die1: ' : null} {this.state.endTurnButtonVisible ? this.state.dice[0] : null}
            </div>
            <div className='die2'>
              {this.state.dice[1] && this.state.endTurnButtonVisible ? 'die2: ' : null} {this.state.endTurnButtonVisible ? this.state.dice[1] : null}
            </div>
            {/* <div>{this.state.diceSum}</div> */}
            <div>{this.state.endTurnButtonVisible ? this.state.diceSumComment : null}</div>
          </div>
          <div className='doubles'>
            {this.state.doublesComment}
          </div>

          {
            this.state.diceRollButtonVisible
              ? <button className='dice-roll-btn' onClick={() => { this.handleDiceRollButtonClick() }}>
                Roll Dice!
              </button> : this.state.endTurnButtonVisible
                ? <button className='end-turn-btn' onClick={() => { this.handleEndTurnButtonClick() }}>
                  End Turn.
              </button> : null
          }

        </div>
        <div className='UserPositions'>
          <div className='CurrentUser'>
            {/* {`The next user to roll is ${this.state.userNames[this.state.currentUser]} @ position ${this.state.userPositions[this.state.currentUser]}`} */}
          </div>
          <div className='UserPositionsArray'>
            {/* <h5>{`The current state of user positions is ${this.state.userPositions}`}</h5> */}
            {/* <h5>{`${this.state.userNames[0]} is at position ${this.state.userPositions[0]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[1]} is at position ${this.state.userPositions[1]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[2]} is at position ${this.state.userPositions[2]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[3]} is at position ${this.state.userPositions[3]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[4]} is at position ${this.state.userPositions[4]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[5]} is at position ${this.state.userPositions[5]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[6]} is at position ${this.state.userPositions[6]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[7]} is at position ${this.state.userPositions[7]}`}</h5> */}
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    userPosArray: state.userPosArray,
    index: state.index
  }
}

DiceRoll.propTypes = {
  dice: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(DiceRoll)
