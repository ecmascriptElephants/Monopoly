import React from 'react'
// import Symbol from './components/Symbol'
import DiceRoll from './dice_roll'

const Board = () => {
  return (
    <div>
      <DiceRoll />
      <div className='board parent'>
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
        </div >
      </div >
    </div >
  )
}

export default Board
