import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import Board from './components/board'
import Land from './components/landing'
import Signup from './components/signup'
import Lobby from './components/lobby'
import { Provider } from 'react-redux'
import store from './components/store/store'
class App extends Component {
  render () {
    return (
      <Router>
        <Provider store={store}>
          <div>
            <Route exact path='/' component={Land} />
            <Route path='/board' component={Board} />
            <Route path='/signup' component={Signup} />
            <Route path='/lobby' component={Lobby} />
          </div>
        </Provider>
      </Router>
    )
  }
}

render(<App />, document.getElementById('container'))
