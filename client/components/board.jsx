import React, { Component } from 'react'
import Symbol from './Symbol'
import Player from './player'
import Chat from './chat'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUserPositions, setPlayers, setPlayerProps, setIndex, setUserProperties } from './store/actionCreators'
import Toast from './toast'
import ToastHistory from './ToastHistory'
import Others from './OtherPlayers'
import Offer from './ShowOffer'

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      playerIndex: -1,
      valid: false,
      showToast: false,
      comment: '',
      showOffer: false
    }
    sock.init({ gameID: this.props.gameID, index: this.props.playerIndex })
    this.dice = this.dice.bind(this)
    this.setComment = this.setComment.bind(this)
    this.showPopup = this.showPopup.bind(this)
  }

  dice (value, index, flag) {
    const location = [
      [97, 97], [97, 83], [97, 75], [97, 66.5], [97, 58.5], [97, 50], [97, 42], [97, 34], [97, 25.5], [97, 17.5], [97, 2.5],
      [84.5, 2.5], [76.4, 2.5], [68.2, 2.5], [60, 2.5], [51.8, 2.5], [43.5, 2.5], [35.4, 2.5], [27.1, 2.5], [19, 2.5], [7, 2.5],
      [7, 17.5], [7, 25.5], [7, 34], [7, 42], [7, 50], [7, 58.5], [7, 66.5], [7, 75], [7, 83],
      [7, 97], [19, 97], [27.1, 97], [35.4, 97], [43.5, 97], [51.8, 97], [60, 97], [68.2, 97], [76.4, 97], [84.5, 97]
    ]
    let playerProps = location[value]
    if (index >= 0) {
      this.props.dispatch(setUserPositions(value, index))
    }
    if (flag) {
      sock.updatePos({ gameID: this.props.gameID, pos: value, index: index })
    }
    this.props.dispatch(setPlayerProps(playerProps, index))
  }

  componentDidMount () {
    sock.socket.on('users', (data) => {
      let players = Object.keys(data.players).map((key) => {
        return data.players[key]
      })
      this.props.dispatch(setPlayers(players))
    })

    sock.socket.on('offer for you', ({position, socket, offer, offerIndex}) => {
      this.setState({position, socket, offer, offerIndex, showOffer: true})
    })

    sock.socket.on('update position', (data) => {
      this.dice(data.pos, data.index, false)
      this.props.dispatch(setIndex(data.index))
    })

    sock.socket.on('update properties', (data) => {
      this.props.dispatch(setUserProperties(data.properties, data.index))
    })
  }

  setComment (comment) {
    console.log('comment', comment)
    this.setState({comment})
  }
  showPopup () {
    this.setState({showOffer: false})
  }
  render () {
    return (
      <div>

        <Player name={this.props.username} dice={this.dice} piece='Hat' setComment={this.setComment}/>
        {
        this.state.showOffer ? <Offer open={this.state.showOffer} offer={this.state.offer} setShowOffer={this.showPopup} position={this.state.position} offerIndex={this.state.offerIndex} /> : null
      }
        <div className={'other-players'}>
          {
            this.props.players.map((player, index) => {
              if (index !== this.props.playerIndex) {
                return <Others key={index} playerUsername={player.username} otherPlayerIndex={index} socket={player.socketID} />
              }
            })
          }
        </div>
        <Player name={this.props.username} dice={this.dice} piece='Hat' />
        <div className='board parent'>
          {
            this.props.players.map((player, index) => {
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
        <Chat name={this.props.username} />
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
    // userPropertiesArray: state.userPropertiesArray,
    index: state.index,
    players: state.players,
    playerIndex: state.playerIndex
  }
}

Board.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  // userPropertiesArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  players: React.PropTypes.array.isRequired,
  playerIndex: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(Board)
