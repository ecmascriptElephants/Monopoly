import React, { Component } from 'react'
import rules from '../static/rules'
import userNames from './user_order'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import {
  setIndex,
  setUserProperties,
  setUserJail,
  setCash
} from './store/actionCreators'
import { Button, List } from 'semantic-ui-react'
import Card from './Cards'
import Move from './moveToken'
class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleEndTurnButtonClick = this.handleEndTurnButtonClick.bind(this)
    this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)
    this.handleGoButtonClick = this.handleGoButtonClick.bind(this)
    this.increaseFunds = this.increaseFunds.bind(this)
    this.reduceFunds = this.reduceFunds.bind(this)
    this.propertyIsOwned = this.propertyIsOwned.bind(this)
    this.handleBuyPropertyButtonClick = this.handleBuyPropertyButtonClick.bind(this)
    this.handlePayRentButtonClick = this.handlePayRentButtonClick.bind(this)
    this.handlePayIncomeTaxButtonClick = this.handlePayIncomeTaxButtonClick.bind(this)
    this.handlePayLuxuryTaxButtonClick = this.handlePayLuxuryTaxButtonClick.bind(this)
    this.mortgageProperty = this.mortgageProperty.bind(this)
    this.unMortgageProperty = this.unMortgageProperty.bind(this)
    this.buyHouse = this.buyHouse.bind(this)
    this.sellHouse = this.sellHouse.bind(this)
    this.handleCardButtonClick = this.handleCardButtonClick.bind(this)
    this.handleJailPayFineButtonClick = this.handleJailPayFineButtonClick.bind(this)
    this.handleJailRollDoublesButtonClick = this.handleJailRollDoublesButtonClick.bind(this)
    this.handleJailFreeCardButtonClick = this.handleJailFreeCardButtonClick.bind(this)

    this.state = {
      dice: [0, 0],
      diceSum: 0,
      comment: '',
      doubles: 0,
      moveTokenButtonVisible: false,
      // needs to be updated gamestate authentication
      cardButtonVisible: false,
      card: true,
      userNames: [userNames[0][0], userNames[1][0], userNames[2][0], userNames[3][0], userNames[4][0], userNames[5][0], userNames[6][0], userNames[7][0]],
      jailPositions: [0, 0, 0, 0, 0, 0, 0, 0],
      userPropertiesArray: [[], [], [], [], [], [], [], []],
      userJailFreeCardArray: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      goButtonVisible: false,
      diceRollButtonVisible: false,
      // needs to be updated gamestate authentication
      endTurnButtonVisible: false,
      buyPropertyButtonVisible: false,
      incomeTaxButtonVisible: false,
      luxuryTaxButtonVisible: false,
      rentOwed: 0,
      propertyOwner: -1,
      payRentButtonVisible: false,
      isBankruptArray: [false, false, false, false, false, false, false, false],
      bankruptcyButtonVisible: false,
      jailPayFineButtonVisible: false,
      jailRollDoublesButtonVisible: false,
      jailFreeCardButtonVisible: false
    }
  }

  componentDidMount () {
    sock.socket.on('yourTurn', (data) => {
      this.setState({
        diceRollButtonVisible: true,
        numOfPlayers: data.numOfPlayers,
        jailPayFineButtonVisible: true,
        jailRollDoublesButtonVisible: true,
        jailFreeCardButtonVisible: true
      })
      window.localStorage.setItem('pIndex', data.index)
      this.props.dispatch(setIndex(data.index))
    })
    sock.socket.on('update properties', (data) => {
      console.log('diceRoll js update properties! socket func! data = ', data)
      let updatedUserPropertiesArray = [...this.state.userPropertiesArray]
      updatedUserPropertiesArray[data.index] = data.properties
      this.setState({ userPropertiesArray: updatedUserPropertiesArray })
      // this.props.dispatch(setUserProperties(data.userProperties, data.index))
    })
    sock.socket.on('update money', (data) => {
      this.props.dispatch(setCash(data.money, data.index))
    })
    sock.socket.on('receive-comment', (comment) => {
      this.setState({ comment: comment })
    })
  }

  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    let doubles = 0
    if (die1 === die2) {
      doubles = this.state.doubles + 1
    }
    this.setState({
      dice: [die1, die2],
      diceSum: die1 + die2,
      doubles: doubles,
      diceRollButtonVisible: false,
      moveTokenButtonVisible: true
    })
  }

  handleEndTurnButtonClick () {
    this.setState({
      dice: [0, 0],
      endTurnButtonVisible: false
    })
    sock.end({ gameID: this.props.gameID, pos: this.props.userPosArray[this.props.index], index: this.props.index })
  }

  handleLandOnOrPassGo (oldUserPosition, userPosition, jail) {
    if (!jail && userPosition < oldUserPosition) {
      console.log('in handleLandOnOrPassGo userPosition, oldUserPosition = ', userPosition, oldUserPosition)
      let goComment = 'You passed GO. Collect $200.'
      if (this.state.comment === 'You landed on GO. Collect $200!') {
        goComment = ''
      }
      this.setState({
        comment: goComment,
        endTurnButtonVisible: false,
        moveTokenButtonVisible: false,
        goButtonVisible: true
      })
    }
  }

  handleGoButtonClick () {
    this.props.dispatch(setCash(200, this.props.index))
    sock.updateMoney({
      gameID: this.props.gameID,
      money: 200,
      index: this.props.index
    })

    let doubles = this.state.doubles
    if (!doubles) {
      this.setState({
        endTurnButtonVisible: true,
        goButtonVisible: false,
        diceRollButtonVisible: false,
        comment: ''
      })
    }
    if (doubles) {
      this.setState({
        diceRollButtonVisible: true,
        goButtonVisible: false,
        endTurnButtonVisible: false,
        comment: ''
      })
    }
  }

  handleCardButtonClick () {
    let doubles = this.state.doubles
    this.setState({
      cardButtonVisible: false,
      endTurnButtonVisible: !doubles,
      diceRollButtonVisible: !!doubles,
      comment: ''
    })
  }

  increaseFunds (value) {
    this.props.dispatch(setCash(value, this.props.index))
  }

  reduceFunds (value) {
    this.props.dispatch(setCash(-value, this.props.index))
  }

  propertyIsOwned (propertyPosition) {
    let ownerNumber = false
    this.state.userPropertiesArray.forEach((propertyArray, index) => {
      propertyArray.forEach((propertyObj) => {
        if (propertyObj.Position === propertyPosition) ownerNumber = index
      })
    })
    return ownerNumber
  }

  handlePayRentButtonClick () {
    let currentUser = this.props.index
    let propertyOwner = this.state.propertyOwner
    let rentOwed = this.state.rentOwed
    let updatedUserMoney = this.props.userCashArray[currentUser]
    let doubles = this.state.doubles
    if (updatedUserMoney < rentOwed) {
      this.setState({
        comment: `You owe ${rentOwed}, but only have ${updatedUserMoney[currentUser]}`
      })
    } else {
      this.props.dispatch(setCash(-rentOwed, currentUser))
      this.props.dispatch(setCash(rentOwed, propertyOwner))
      sock.updateMoney({ gameID: this.props.gameID, money: -rentOwed, index: currentUser })
      sock.updateMoney({ gameID: this.props.gameID, money: rentOwed, index: propertyOwner })
      this.setState({
        propertyOwner: '',
        rentOwed: 0,
        payRentButtonVisible: false,
        endTurnButtonVisible: !doubles,
        diceRollButtonVisible: !!doubles
      })
    }
  }

  handlePayIncomeTaxButtonClick () {
    let doubles = this.state.doubles
    let updatedUserMoneyArray = this.props.userCashArray
    if (updatedUserMoneyArray[this.props.index] < 200) {
      this.setState({
        comment: 'You do not have enough money to pay the $200 income tax.',
        endTurnButtonVisible: false,
        moveTokenButtonVisible: false
      })
    } else {
      this.props.dispatch(setCash(-200, this.props.index))
      sock.updateMoney({
        gameID: this.props.gameID,
        money: updatedUserMoneyArray[this.props.index],
        index: this.props.index
      })
      if (!doubles) {
        this.setState({
          moveTokenButtonVisible: false,
          incomeTaxButtonVisible: false,
          endTurnButtonVisible: true,
          comment: ''
        })
      }
      if (doubles > 0) {
        this.setState({
          moveTokenButtonVisible: false,
          endTurnButtonVisible: false,
          incomeTaxButtonVisible: false,
          diceRollButtonVisible: true,
          comment: ''
        })
      }
    }
  }

  handlePayLuxuryTaxButtonClick () {
    let doubles = this.state.doubles
    let updatedUserMoneyArray = this.props.userCashArray
    if (updatedUserMoneyArray[this.props.index] < 100) {
      this.setState({
        endTurnButtonVisible: false,
        moveTokenButtonVisible: false
      })
    } else {
      this.props.dispatch(setCash(-100, this.props.index))
      sock.updateMoney({
        gameID: this.props.gameID,
        money: updatedUserMoneyArray[this.props.index],
        index: this.props.index
      })
      if (!doubles) {
        this.setState({
          moveTokenButtonVisible: false,
          endTurnButtonVisible: true,
          luxuryTaxButtonVisible: false
        })
      }
      if (doubles > 0) {
        this.setState({
          moveTokenButtonVisible: false,
          endTurnButtonVisible: false,
          luxuryTaxButtonVisible: false,
          diceRollButtonVisible: true
        })
      }
    }
  }

  handleBuyPropertyButtonClick () {
    let propertyPosition = this.props.userPosArray[this.props.index]
    let propertiesArray = [...this.state.userPropertiesArray[this.props.index]]
    // console.log('diceRoll.jsx line 382 handleBuyPropertyButtonClick propertiesArray = ', propertiesArray, Array.isArray(propertiesArray))
    let propertyPrice = 0
    let newProperty = { PropertyObj: {}, Mortgaged: false, Houses: 0, Position: propertyPosition }
    rules.Properties.forEach((property) => {
      if (property.BOARD_POSITION === propertyPosition) {
        propertyPrice = property.PRICE
        newProperty.PropertyObj = property
        propertiesArray.push(newProperty)
        console.log('propertiesArray = ', propertiesArray, propertiesArray.length, Array.isArray(propertiesArray))
      }
    })

    if (this.props.userCashArray[this.props.index] < propertyPrice) {
      this.setState({
        endTurnButtonVisible: true,
        buyPropertyButtonVisible: false,
        moveTokenButtonVisible: false
      })
      if (this.state.doubles) {
        this.setState({
          endTurnButtonVisible: false,
          diceRollButtonVisible: true
        })
      }
    } else {
      let updatedUserMoneyArray = this.props.userCashArray
      updatedUserMoneyArray[this.props.index] -= propertyPrice
      this.props.dispatch(setCash(-propertyPrice, this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: -propertyPrice, index: this.props.index })

      let updatedUserProperties = [...this.state.userPropertiesArray]

      updatedUserProperties[this.props.index] = propertiesArray
      this.setState({
        comment: `You bought ${newProperty.PropertyObj.NAME}, cost $${newProperty.PropertyObj.PRICE}`,
        buyPropertyButtonVisible: false,
        endTurnButtonVisible: true,
        moveTokenButtonVisible: false,
        userPropertiesArray: updatedUserProperties
      })
      if (this.state.doubles) {
        this.setState({
          endTurnButtonVisible: false,
          diceRollButtonVisible: true
        })
      }
      this.props.dispatch(setUserProperties(updatedUserProperties, this.props.index))
      sock.updateProps({ gameID: this.props.gameID, properties: updatedUserProperties[this.props.index], index: this.props.index })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} bought ${newProperty.PropertyObj.NAME}!`)
    }
  }

  mortgageProperty (propertyPosition) {
    let tempProperty = this.state.property
    let mortgageAmount = 0
    tempProperty.forEach((property) => {
      if (property.Position === propertyPosition) {
        property.Mortgaged = true
        mortgageAmount = property.PropertyObj.MORTGAGE_PRICE
      }
    })
    this.increaseFunds(mortgageAmount)
    this.setState({
      property: tempProperty
    })
  }

  handleJailPayFineButtonClick () {
    if (this.props.userCashArray[this.props.index] < 50) {
    } else {
      this.props.dispatch(setCash(-50, this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: -50, index: this.props.index })

      let updatedJailPositions = [...this.state.jailPositions]
      updatedJailPositions[this.props.index] = 0
      this.props.dispatch(setUserJail(updatedJailPositions[this.props.index], this.props.index))

      console.log('in diceRoll js line 649 handleJailPayFineButtonClick has been invoked')
      this.setState({
        diceRollButtonVisible: true,
        jailPositions: updatedJailPositions,
        jailPayFineButtonVisible: false,
        jailRollDoublesButtonVisible: false,
        jailFreeCardButtonVisible: false
      })
    }
  }

  handleJailRollDoublesButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    // show dice
    this.setState({
      dice: [die1, die2]
    })
    if (die1 === die2) {
      let updatedJailPositionsArray = [...this.state.jailPositions]
      updatedJailPositionsArray[this.props.index] = 0
      this.setState({
        moveTokenButtonVisible: true,
        comment: `You rolled doubles and left jail. Move ${die1 + die2} spaces.`,
        jailPositions: updatedJailPositionsArray,
        jailRollDoublesButtonVisible: false
      })
    } else {
      let updatedJailPositionsArray = [...this.state.jailPositions]
      updatedJailPositionsArray[this.props.index] += 1

      this.setState({
        comment: 'You did not roll doubles :(.',
        endTurnButtonVisible: true,
        jailPositions: updatedJailPositionsArray,
        jailRollDoublesButtonVisible: false
      })
    }
  }

  handleJailFreeCardButtonClick () {
    if (this.state.userJailFreeCardArray[this.props.index][0] === 0 && this.state.userJailFreeCardArray[this.props.index][1] === 0) {

    }
    // check if a user has a jail free card
    // if so,
    // remove user's jail free card
    // set jail to 0
    // set comment to ''
    // make diceRollButtonVisible
    // if not,
    // say, you do not own a jail free card
    // make jail free card button disappear
  }

  unMortgageProperty (propertyPosition) {
    let tempProperty = this.state.property
    let unMortgageAmount = 0
    tempProperty.forEach((property) => {
      if (property.Position === propertyPosition && property.Mortgaged) {
        property.Mortgaged = false
        unMortgageAmount = property.PropertyObj.UNMORTGAGE_PRICE
      }
    })
    this.reduceFunds(unMortgageAmount)
    this.setState({
      property: tempProperty
    })
  }

  buyHouse (propertyPosition) {
    let propertiesArray = this.state.property
    let housePrice = 0
    let numberOfPropsNeededForMonopoly = 0
    let propertyGroup = ''
    propertiesArray.forEach((property) => {
      if (property.Position === propertyPosition && property.PropertyObj.ALLOWS_HOUSES && property.Houses < 5) {
        housePrice = property.PropertyObj.HOUSE_PRICE
        numberOfPropsNeededForMonopoly = property.PropertyObj.NUMBER_OF_PROPERTIES_IN_GROUP
        propertyGroup = property.PropertyObj.PROPERTY_GROUP
        property.Houses += 1
      }
    })
    let propertiesInGroupCount = propertiesArray.reduce((numberOfPropertiesInGroup, property) => {
      if (property.PropertyObj.PROPERTY_GROUP === propertyGroup) {
        numberOfPropertiesInGroup += 1
      }
    }, 0)
    if (numberOfPropsNeededForMonopoly === propertiesInGroupCount && this.props.userCashArray[this.props.index] >= housePrice) {
      this.reduceFunds(housePrice)
      this.setState({
        property: propertiesArray
      })
    } else {
      if (this.state.money < housePrice) {
        console.log('You do not have sufficient funds to purchase additional houses')
      } else {
        console.log(`You need ${numberOfPropsNeededForMonopoly} properties in order to have a monopoly, but you only have ${propertiesInGroupCount}.`)
      }
    }
  }

  sellHouse (propertyPosition) {
    let propertiesArray = this.state.property
    let houseSalePrice = 0
    propertiesArray.forEach((property) => {
      if (property.Position === propertyPosition && property.Houses > 0) {
        houseSalePrice = property.PropertyObj.HOUSE_SALE_PRICE
        property.Houses -= 1
      }
    })
    this.increaseFunds(houseSalePrice)
    this.setState({
      property: propertiesArray
    })
  }

  checkBankruptcy () {

  }

  handleBankruptcyButtonClick () {
    this.props.userCashArray[this.props.index] = 0
    this.state.userPropertiesArray[this.props.index] = []
    this.state.isBankruptArray[this.props.index] = true
  }

  handleMortgageButtonClick (propertyName) {
    console.log('click mortgage button!')
    console.log(this.state.userPropertiesArray[this.props.index])
    // console.log('proerty name', propertyName)
    // console.log('before', updatedUserMoneyArray[this.props.index])
    let updatedUserProperties = [...this.state.userPropertiesArray]
    console.log('before', updatedUserProperties)
    updatedUserProperties[this.props.index].forEach((property, i, arr) => {
      if (property.PropertyObj.NAME === propertyName) {
        this.props.dispatch(setCash(property.PropertyObj.MORTGAGE_PRICE, this.props.index))
        arr.splice(i, 1)
      }
    })
    this.setState({
      // buyPropertyButtonVisible: false,
      userPropertiesArray: updatedUserProperties
    })
    // console.log('after', updatedUserProperties)
  }

  render () {
    return (
      <div className='user-positions_dice-roll_div'>
        <div className='dice-roll_div'>
          <div className='dice_div'>
            <div>{this.state.dice[0] ? `die1: ${this.state.dice[0]}` : null}</div>
            <div>{this.state.dice[1] ? `die2: ${this.state.dice[1]}` : null}</div>
          </div>
          <div className='buttons_div'>
            <div className='dice-roll-btn_div'>
              {(this.state.diceRollButtonVisible && !this.state.payRentButtonVisible && !this.state.jailPositions[this.props.index])
                ? <div>
                  <div>{this.props.index === -1 ? null : `${this.state.userNames[this.props.index]} it is your turn. Roll the dice!`}</div>
                  <Button secondary fluid onClick={() => { this.handleDiceRollButtonClick() }}>Roll Dice</Button>
                </div> : null
              }
            </div>
            <div className='move-token-btn_div'>
              {this.state.moveTokenButtonVisible
                ? <div>
                  <Move
                    doubles={this.state.doubles}
                    diceSum={this.state.diceSum}
                    dice={this.props.dice}
                    userNames={this.state.userNames} />
                </div> : null
              }
            </div>
            {
              this.state.cardButtonVisible ? <Card button={() => { this.handleCardButtonClick() }}
                card={this.state.card}
                number={this.state.numOfPlayers}
                /> : null
            }
            <div className='buy-property-btn_div'>
              {(this.state.buyPropertyButtonVisible && !this.state.goButtonVisible)
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleBuyPropertyButtonClick() }}>  Buy This Property. </Button>
                </div> : null
              }
            </div>
            <div className='pass-go-btn_div'>
              {this.state.goButtonVisible
                ? <div>
                  <div>{this.state.comment}</div>
                  <Button secondary fluid onClick={() => { this.handleGoButtonClick() }}>  Collect $200. </Button>
                </div> : null
              }
            </div>
            <div className='income-tax-btn_div'>
              {this.state.incomeTaxButtonVisible
                ? <div>
                  <div>{this.state.comment}</div>
                  <Button secondary fluid onClick={() => { this.handlePayIncomeTaxButtonClick() }}>  Pay $200 in income tax. </Button>
                </div> : null
              }
            </div>
            <div className='luxury-tax-btn_div'>
              {this.state.luxuryTaxButtonVisible
                ? <div>
                  <div>{this.state.comment}</div>
                  <Button secondary fluid onClick={() => { this.handlePayLuxuryTaxButtonClick() }}>  Pay $100 in luxury tax. </Button>
                </div> : null
              }
            </div>
            <div className='pay-rent-btn_div'>
              {(this.state.payRentButtonVisible && !this.state.goButtonVisible)
                ? <div>
                  <div className='rent-comment'>
                    {this.state.payRentComment}
                  </div>
                  <Button secondary fluid onClick={() => { this.handlePayRentButtonClick() }}>  Pay Rent. </Button>
                </div> : null
              }
            </div>
            <div className='end-turn-btn_div'>
              {(this.state.endTurnButtonVisible && !this.state.luxuryTaxButtonVisible && !this.state.goButtonVisible && !this.state.incomeTaxButtonVisible && !this.state.payRentButtonVisible)
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleEndTurnButtonClick() }}>  End Turn. </Button>
                </div> : null
              }
            </div>
            <div className='bankruptcy-btn_div'>
              {this.state.bankruptcyButtonVisible
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleBankruptcyButtonClick() }}> Bankruptcy. </Button>
                </div> : null
              }
            </div>
          </div>
          <div className='jail_div'>
            {(this.state.jailPositions[this.props.index] && !this.state.endTurnButtonVisible)
              ? <div>
                <div> {this.state.jailPayFineButtonVisible ? 'You are in jail. Pay' +
                  ' $50 to get out immediately, try to roll doubles, or use' +
                  ' a Get Out of Jail Free card' : 'You are in jail :( '} </div>
                <div className='jail-pay-fine-btn_div'>
                  {(this.state.jailPayFineButtonVisible && !this.state.endTurnButtonVisible)
                    ? <div>
                      <div>{this.state.comment}</div>
                      <Button secondary fluid onClick={() => {
                        this.handleJailPayFineButtonClick()
                      }}> Pay $50. </Button>
                    </div> : null
                  }
                </div>
                <div className='jail-roll-doubles-btn_div'>
                  {(this.state.jailRollDoublesButtonVisible && !this.state.endTurnButtonVisible)
                    ? <div>
                      <Button secondary fluid onClick={() => {
                        this.handleJailRollDoublesButtonClick()
                      }}> Attempt to roll doubles. </Button>
                    </div> : null
                  }
                </div>
                <div className='jail-free-card-btn_div'>
                  {(this.state.jailFreeCardButtonVisible && !this.state.endTurnButtonVisible)
                    ? <div>
                      <Button secondary fluid onClick={() => {
                        this.handleJailFreeCardButtonClick()
                      }}> Use a jail free card. </Button>
                    </div> : null
                  }
                </div>
              </div> : null
            }
          </div>
        </div>
        <div className='UserMoney_div'>
          {`Everyone's Money ${this.props.userCashArray}`}
        </div>
        <div className='Comments_div'>
          <div className='doubles-comment_div'>
            {this.state.comment}
          </div>
        </div>
        <div className='CurrentUser_div'>
          <div className='CurrentUserMoney'>
            {this.props.index === -1 ? null : `You have: $${this.props.userCashArray[this.props.index]}`}
          </div>
          <div className='CurrentUserProperties'>
            <div>
              Properties : {this.props.index === -1 ? null : <List items={this.state.userPropertiesArray[this.props.index].map(e => {
                return <div>{e.PropertyObj.NAME} <button onClick={() => { this.handleMortgageButtonClick(e.PropertyObj.NAME) }}>Mortgage</button></div>
              })} />}
            </div>
          </div>
        </div>
        <div className='UserPositions'>
          <div className='CurrentUser' />
          <div className='UserPositionsArray' />
        </div>
        <div className='comment'>
          {this.state.comment}
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
    userPropertiesArray: state.userPropertiesArray,
    jailPositions: state.jailPositions,
    index: state.index,
    userCashArray: state.userCashArray
  }
}

DiceRoll.propTypes = {
  dice: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  jailPositions: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userPropertiesArray: React.PropTypes.array.isRequired,
  userCashArray: React.PropTypes.array.isRequired
}

export default connect(mapStateToProps)(DiceRoll)
