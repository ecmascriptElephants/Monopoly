import React from 'react'

class DiceRoll extends React.Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.state = {
      dice: []
    }
  }

  handleDiceRollButtonClick () {
    this.setState({
      dice: [1 + Math.floor((6 * Math.random())), 1 + Math.floor((6 * Math.random()))]
    })
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
        <button className='dice-roll-btn' onClick={this.handleDiceRollButtonClick}>
          Roll Dice!
        </button>
      </div>
    )
  }
}

export default DiceRoll
