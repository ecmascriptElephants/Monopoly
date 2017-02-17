import React, { Component } from 'react'
import Symbol from './Symbol'
import DiceRoll from './dice_roll'
import Player from './player'
import sock from '../helper/socket'
import { connect } from 'react-redux'
class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      players: []
    }
    sock.init({gameID: this.props.gameID})
    this.dice = this.dice.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.dice(nextProps.index, nextProps.userPosArray)
  }

  dice (index, array) {
    const location = [
      [97, 97], [97, 83], [97, 75], [97, 66.5], [97, 58.5], [97, 50], [97, 42], [97, 34], [97, 25.5], [97, 17.5], [97, 2.5],
      [84.5, 2.5], [76.4, 2.5], [68.2, 2.5], [60, 2.5], [51.8, 2.5], [43.5, 2.5], [35.4, 2.5], [27.1, 2.5], [19, 2.5], [7, 2.5],
      [7, 17.5], [7, 25.5], [7, 34], [7, 42], [7, 50], [7, 58.5], [7, 66.5], [7, 75], [7, 83],
      [7, 97], [19, 97], [27.1, 97], [35.4, 97], [43.5, 97], [51.8, 97], [60, 97], [68.2, 97], [76.4, 97], [84.5, 97]
    ]
    let players = [...this.state.players]
    players[index].userPosition = location[array[index]]
    this.setState({players})
    // this.setState.players[index].userPosition = location[array[index]]
    // this.setState({
    //   user0: location[userPositionsArray[0]],
    //   user1: location[userPositionsArray[1]],
    //   user2: location[userPositionsArray[2]],
    //   user3: location[userPositionsArray[3]],
    //   user4: location[userPositionsArray[4]],
    //   user5: location[userPositionsArray[5]],
    //   user6: location[userPositionsArray[6]],
    //   user7: location[userPositionsArray[7]]
    // })
  }
  componentDidMount () {
    sock.socket.on('users', (data) => {
      console.log(data)
      this.setState({players: data.players})
    })
  }

  render () {
    return (
      <div>
        <DiceRoll dice={this.dice} />
        <Player name={this.props.username} piece='Hat' />
        <div className='board parent'>
          {
            this.state.players.map((player, index) => {
              if (index <= 3) {
                return <Symbol className={`token${index}`} left={`${player.userPosition[1]}%`} top={`${player.userPosition[0] - (index + index)}%`} userNumber={index} key={index} />
              } else {
                return <Symbol className={`token${index}`} left={`${player.userPosition[1] - 2}%`} top={`${player.userPosition[0] - (index + 4)}%`} userNumber={index} key={index} />
              }
            })
          }
          <div className='wire'>
            <div className='flexcol'>
              <div className='flexrow'>
                <div className='top' id='Position20'>
                  20
                </div>
                <div className='item' id='Position21'>
                  21
                </div>
                <div className='item' id='Position22'>
                  22
                </div>
                <div className='item' id='Position23'>
                  23
                </div>
                <div className='item' id='Position24'>
                  24
                </div>
                <div className='item' id='Position25'>
                  25
                </div>
                <div className='item' id='Position26'>
                  26
                </div>
                <div className='item' id='Position27'>
                  27
                </div>
                <div className='item' id='Position28'>
                  28
                </div>
                <div className='item' id='Position29'>
                  29
                </div>
                <div className='top' id='Position30'>
                  30
                </div>
              </div>
              <div className='flexmiddle'>
                <div className='flexside'>
                  <div className='item' id='Position19'>
                    19
                  </div>
                  <div className='item' id='Position18'>
                    18
                  </div>
                  <div className='item' id='Position17'>
                    17
                  </div>
                  <div className='item' id='Position16'>
                    16
                  </div>
                  <div className='item' id='Position15'>
                    15
                  </div>
                  <div className='item' id='Position14'>
                    14
                  </div>
                  <div className='item' id='Position13'>
                    13
                  </div>
                  <div className='item' id='Position12'>
                    12
                  </div>
                  <div className='item' id='Position11'>
                    11
                  </div>
                </div>
                <div className='flexside'>
                  <div className='item' id='Position31'>
                    31
                  </div>
                  <div className='item' id='Position32'>
                    32
                  </div>
                  <div className='item' id='Position33'>
                    33
                  </div>
                  <div className='item' id='Position34'>
                    34
                  </div>
                  <div className='item' id='Position35'>
                    35
                  </div>
                  <div className='item' id='Position36'>
                    36
                  </div>
                  <div className='item' id='Position37'>
                    37
                  </div>
                  <div className='item' id='Position38'>
                    38
                  </div>
                  <div className='item' id='Position39'>
                    39
                  </div>
                </div>
              </div>
              <div className='flexrow'>
                <div className='top' id='Position10'>
                  10
                </div>
                <div className='item' id='Position9'>
                  9
                </div>
                <div className='item' id='Position8'>
                  8
                </div>
                <div className='item' id='Position7'>
                  7
                </div>
                <div className='item' id='Position6'>
                  6
                </div>
                <div className='item' id='Position5'>
                  5
                </div>
                <div className='item' id='Position4'>
                  4
                </div>
                <div className='item' id='Position3'>
                  3
                </div>
                <div className='item' id='Position2'>
                  2
                </div>
                <div className='item' id='Position1'>
                  1
                </div>
                <div className='top' id='Position0'>
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    userPosArray: state.userPosArray,
    index: state.index
  }
}

Board.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Board)
