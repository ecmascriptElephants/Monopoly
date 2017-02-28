import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Image, Modal, Input, Label, Icon } from 'semantic-ui-react'
import sock from '../helper/socket'
class ShowOffer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      counterOffer: null
    }
  }

  render () {
    return (
      <Modal open={this.props.open} basic size='small'>
        <Header icon='archive' content='Offer' />
        <Modal.Content>
          <p>Someone made an offer for your Property</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' inverted>
            <Icon name='remove' /> Decline
      </Button>
          <Button color='green' inverted>
            <Icon name='checkmark' /> Accept
      </Button>
        </Modal.Actions>
      </Modal>
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

ShowOffer.propTypes = {
  gameID: React.PropTypes.number.isRequired,
  playerUsername: React.PropTypes.string.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  otherPlayerIndex: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  position: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  playerName: React.PropTypes.string.isRequired,
  property: React.PropTypes.string.isRequired,
  socket: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(ShowOffer)

