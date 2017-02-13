import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Board from './components/board'
import Land from './components/landing'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Land} />
          <Route path='/board' component={Board} />
        </div>
      </Router>
    )
  }
}

render(<App />, document.getElementById('container'))
