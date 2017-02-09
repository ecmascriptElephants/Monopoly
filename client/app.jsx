import React from 'react'
import ReactDOM from 'react-dom'

import DiceRoll from './components/dice_roll'

const App = function () {
  return (
    <div>
      <div>
        Hello
      </div>
      <DiceRoll />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('container'))
