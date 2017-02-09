import React from 'react'
import ReactDOM from 'react-dom'
import Symbol from './components/Symbol'
import DiceRoll from './components/dice_roll'

class App extends React.Component {

  render () {
    return (
      <div className='board'>
        <Symbol />
        <DiceRoll />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
