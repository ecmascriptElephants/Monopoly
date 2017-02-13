import React, { Component } from 'react'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleDoubles = this.handleDoubles.bind(this)
    this.handleAddDiceRollToUserPosition = this.handleAddDiceRollToUserPosition.bind(this)
    this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)

    this.state = {
      dice: [],
      diceSum: 0,
      diceSumComment: '',
      doubles: 0,
      doublesComment: '',
      currentUser: 0,
      // needs to be updated gamestate authentication
      userNames: ['Jeremy', 'Kyle', 'RJ', 'Joseph', 'Jeff', 'Justin', 'Jerry', 'Nino'],
      // up to 8 players all starting on GO or position 1
      userPositions: [0, 0, 0, 0, 0, 0, 0, 0]
    }
  }

  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if (die1 === die2) {
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
        doublesComment: ''
      })
      this.handleAddDiceRollToUserPosition(die1, die2)
    }
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
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: 0,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles three times in a row. Go to Jail. :(`
      })
    }
  }

  handleAddDiceRollToUserPosition (die1, die2, doubles) {
    console.log('handleAddDiceRollToUserPosition has been invoked!', this.state.userPositions[this.state.currentUser], die1 + die2)
    // store userPositions array
    let updatedUserPositions = this.state.userPositions
    // current player's old position
    let oldCurrentUserPosition = updatedUserPositions[this.state.currentUser]
    // update current player's position based on diceroll
    let updatedCurrentUserPosition = (oldCurrentUserPosition + die1 + die2) % 40
    // update the userPositions array with the new current players position
    updatedUserPositions[this.state.currentUser] = updatedCurrentUserPosition
    // update the current user to the next user
    let newCurrentUser = (this.state.currentUser + 1) % this.state.userPositions.length
    if(doubles === 1 || doubles === 2) {
      newCurrentUser = this.state.currentUser
    }
    // check if the user is landing on or passing go, NOTE still need to deal with jail
    this.handleLandOnOrPassGo(oldCurrentUserPosition, updatedCurrentUserPosition)
    this.setState({
      currentUser: newCurrentUser,
      userPositions: updatedUserPositions
    })
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
            <div className='die1'>
              {this.state.dice[0] ? 'die1: ' : ''} {this.state.dice[0]}
            </div>
            <div className='die2'>
              {this.state.dice[1] ? 'die2: ' : ''} {this.state.dice[1]}
            </div>
            {/* <div>{this.state.diceSum}</div> */}
            <div>{this.state.diceSumComment}</div>
          </div>
          <div className='doubles'>
            {this.state.doublesComment}
          </div>
          <button className='dice-roll-btn' onClick={() => { this.handleDiceRollButtonClick() }}>
            {/* onClick={this.handleDiceRollButtonClick} */}
            Roll Dice!
          </button>
        </div>
        <div className='UserPositions'>
          <div className='CurrentUser'>
            {`The current user is ${this.state.userNames[this.state.currentUser]} @ position ${this.state.userPositions[this.state.currentUser]}`}
          </div>
          <div className='UserPositionsArray'>
            <h5>{`The current state of user positions is ${this.state.userPositions}`}</h5>
            <h5>{`${this.state.userNames[0]} is at position ${this.state.userPositions[0]}`}</h5>
            <h5>{`${this.state.userNames[1]} is at position ${this.state.userPositions[1]}`}</h5>
            <h5>{`${this.state.userNames[2]} is at position ${this.state.userPositions[2]}`}</h5>
            <h5>{`${this.state.userNames[3]} is at position ${this.state.userPositions[3]}`}</h5>
            <h5>{`${this.state.userNames[4]} is at position ${this.state.userPositions[4]}`}</h5>
            <h5>{`${this.state.userNames[5]} is at position ${this.state.userPositions[5]}`}</h5>
            <h5>{`${this.state.userNames[6]} is at position ${this.state.userPositions[6]}`}</h5>
            <h5>{`${this.state.userNames[7]} is at position ${this.state.userPositions[7]}`}</h5>
          </div>
        </div>
      </div>
    )
  }
}

export default DiceRoll
