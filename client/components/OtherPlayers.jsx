import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Message, Divider, Container, Icon, Segment, Header, List } from 'semantic-ui-react'
class OtherPlayers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userObj: {}
    }
  }

  componentDidMount () {

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
            {this.props.userCashArray[this.props.playerIndex]}
          </Message>
        {  <List items={this.props.userPropertiesArray[this.props.playerIndex].map((e, index) => {
            return <div key={index} className={e.PropertyObj.PROPERTY_GROUP} >{e.PropertyObj.NAME} </div>
          })} />>}
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
    userPropertiesArray: state.userPropertiesArray
  }
}

OtherPlayers.propTypes = {
  gameID: React.PropTypes.number.isRequired,
  playerUsername: React.PropTypes.string.isRequired,
  userCashArray: React.PropTypes.array.isRequired,
  playerIndex: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  
}
export default connect(mapStateToProps)(OtherPlayers)
