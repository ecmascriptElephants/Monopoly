import React, { Component } from 'react'
import Symbol from './Symbol'
import DiceRoll from './dice_roll'
import Player from './player'

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      left: '96%',
      top: '96%'
    }
    this.dice = this.dice.bind(this)
  }

  dice (value) {
    var location = 96 - (8 * (value + 1))
    this.setState({
      left: `${location.toString()}%`
    })
  }

  render () {
    return (
      <div>
        <DiceRoll dice={this.dice} />
        <Player name='RJ' piece='Hat' />
        <div className='board parent'>
          <Symbol className='token' left={this.state.left} top={this.state.top} />
          <div className='wire'>
            <div className='flexcol'>
              <div className='flexrow'>
                <div className='top' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='top' />
              </div>
              <div className='flexmiddle'>
                <div className='flexside'>
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                </div>
                <div className='flexside'>
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                  <div className='item' />
                </div>
              </div>
              <div className='flexrow'>
                <div className='top' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='item' />
                <div className='top' />
              </div>
            </div>
          </div >
        </div >
      </div >
    )
  }
}

export default Board
