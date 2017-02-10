import React from 'react'
import ReactDOM from 'react-dom'
// import Symbol from './components/Symbol'
import DiceRoll from './components/dice_roll'
import Board from './components/board'

class App extends React.Component {

  render () {
    return (
      <div>
        <h1>Monopoly!</h1>
        <DiceRoll />
        <Board />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
