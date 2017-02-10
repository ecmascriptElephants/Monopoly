import React, { Component } from 'react'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleDoubles = this.handleDoubles.bind(this)
    this.state = {
      dice: [],
      doubles: 0,
      doublesComment: ''
    }
  }

  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if (die1 === die2) {
      this.handleDoubles()
      this.setState({
        dice: [die1, die2],
        doubles: this.state.doubles += 1
      })
    } else {
      this.setState({
        dice: [die1, die2],
        doubles: 0,
        doublesComment: ''
      })
    }
  }

  handleDoubles () {
    console.log('handleDoubles has been invoked')
    if (this.state.doubles === 0) {
      this.setState({
        dice: this.state.dice,
        doubles: this.state.doubles,
        doublesComment: 'You have rolled doubles! Roll again!'
      })
    } else if (this.state.doubles === 1) {
      this.setState({
        dice: this.state.dice,
        doubles: this.state.doubles,
        doublesComment: 'You have rolled doubles! Roll again!'
      })
    } else if (this.state.doubles === 2) {
      this.setState({
        dice: this.state.dice,
        doubles: this.state.doubles,
        doublesComment: 'You rolled doubles three times in a row. Go to Jail. :('
      })
    }
    console.log(this.state.doublesComment)
  }

  render () {
    return (
      <div className='dice-roll-div'>
        <div className='die-one'>
          {this.state.dice[0]}
        </div>
        <div className='die-two'>
          {this.state.dice[1]}
        </div>
        <div className='doubles'>
          {this.state.doublesComment}
        </div>
        <button className='dice-roll-btn' onClick={this.handleDiceRollButtonClick}>
          Roll Dice!
        </button>
      </div>
    )
  }
}

export default DiceRoll
