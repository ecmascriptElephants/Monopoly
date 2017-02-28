import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Message, Divider, Container, Icon, Segment, Header, List } from 'semantic-ui-react'
import Trade from './Trade'
class OtherPlayers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userObj: {}
    }
  }

  render () {
    return (
      <Container>
        <Segment raised vertical compact className='content'>
          <Header as='h6' icon textAlign='center'>
            <Icon name='users' circular />
            <Header.Content>
              {this.props.playerUsername}
            </Header.Content>
          </Header>
          <Divider />
          <Message>
            {this.props.userCashArray[this.props.otherPlayerIndex]}
          </Message>
          {this.props.playerIndex === this.props.index ? <List items={this.props.userPropertiesArray[this.props.otherPlayerIndex].map((e, index) => {
            console.log(e)
            return <div key={index} className={e.PropertyObj.PROPERTY_GROUP} >{e.PropertyObj.NAME}
              <Trade playerUsername={this.props.playerUsername} property={e.PropertyObj.NAME} socket={this.props.socket} position={e.Position} />
            </div>
          })} /> : null
          }
        </Segment>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gameID: state.gameID,
    players: state.players,
    userCashArray: state.userCashArray,
    userPropertiesArray: state.userPropertiesArray,
    index: state.index,
    playerIndex: state.playerIndex
  }
}

OtherPlayers.propTypes = {
  gameID: React.PropTypes.number.isRequired,
  playerUsername: React.PropTypes.string.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  otherPlayerIndex: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  socket: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(OtherPlayers)
