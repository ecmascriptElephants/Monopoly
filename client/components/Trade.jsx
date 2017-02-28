import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Image, Modal, Input, Label } from 'semantic-ui-react'

class Trade extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offer: 0,
      open: false
    }
  }

  open () {
    this.setState({open: true})
  }

  close () {
    this.setState({open: false})
  }

  handleOffer (e) {
    this.setState({offer: e})
  }

  render () {
    return (
      <div>
        <Button onClick={this.open()}>Trade</Button>
        <Modal open={this.state.open}>
          <Modal.Header>Trade {this.props.property}</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src='http://semantic-ui.com/images/avatar2/large/rachel.png' />
            <Modal.Description>
              <Header>Trade with {this.props.playerName}</Header>
              <Input labelPosition='right' type='text' placeholder='Offer' onChange={this.handleOffer}>
                <Label basic>$</Label>
                <input />
                <Label>.00</Label>
              </Input>
            </Modal.Description>
          </Modal.Content>
          <Button onClick={this.close()}>close</Button>
          <Button onClick={this.offer()}>Offer</Button>
        </Modal>
      </div>
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

Trade.propTypes = {
  gameID: React.PropTypes.number.isRequired,
  playerUsername: React.PropTypes.string.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  otherPlayerIndex: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  playerName: React.PropTypes.string.isRequired,
  property: React.PropTypes.string.isRequired
}
export default connect(mapStateToProps)(Trade)

