import React from 'react'
import Symbol from './Symbol'
import DiceRoll from './dice_roll'

const Board = () => {
  return (
    <div>
      <DiceRoll />
      <div className='board parent'>
        <Symbol style={{'order': 0}} />
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
              <div className='top'style={{'order': 0}} />
            </div>
          </div>
        </div >
      </div >
    </div >
  )
}

export default Board
