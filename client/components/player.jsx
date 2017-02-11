import React, { Component } from 'react'
import { Button, Header, Container, Segment, Icon, Divider } from 'semantic-ui-react'

class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name,
      piece: props.piece,
      money: 0,
      property: [],
      turn: false
    }
    this.increaseFunds = this.increaseFunds(this)
    this.reduceFunds = this.reduceFunds.bind(this)
  }
  increaseFunds (value) {
    this.setState = {
      money: (this.state.money + value)
    }
  }
  reduceFunds (value) {
    this.setState = {
      money: (this.state.money - value)
    }
  }

  render () {
    return (
      <div>
        <Container>
          <Segment raised vertical compact>
            <Header as='h6' icon textAlign='center'>
              <Icon name='users' circular />
              <Header.Content>
                {this.state.name}
              </Header.Content>
            </Header>
            <Divider />
            <Button secondary fluid>Roll Dice</Button>
          </Segment>
        </Container>
      </div>
    )
  }
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  piece: React.PropTypes.string.isRequired
}
export default Player
