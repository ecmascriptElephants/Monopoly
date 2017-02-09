import React from 'react'
import ReactDOM from 'react-dom'
import Symbol from './components/Symbol'
import DiceRoll from './components/dice_roll'

class App extends React.Component {

  render () {
    return (
      <div>
        <h1>Monopoly!</h1>
        <DiceRoll />
        <div className='board'>
          <Symbol />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
