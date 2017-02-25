import React, { Component } from 'react'
import rules from '../static/rules'
import userNames from './user_order'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUserPositions, setIndex, setUserProperties, setUserMoney } from './store/actionCreators'
import { Button, List } from 'semantic-ui-react'
import Card from './Cards'
class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleMoveTokenButtonClick = this.handleMoveTokenButtonClick.bind(this)
    this.handleEndTurnButtonClick = this.handleEndTurnButtonClick.bind(this)
    // this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)
    this.increaseFunds = this.increaseFunds.bind(this)
    this.reduceFunds = this.reduceFunds.bind(this)
    this.propertyIsOwned = this.propertyIsOwned.bind(this)
    this.handleBuyPropertyButtonClick = this.handleBuyPropertyButtonClick.bind(this)
    this.handlePayRentButtonClick = this.handlePayRentButtonClick.bind(this)
    this.mortgageProperty = this.mortgageProperty.bind(this)
    this.unMortgageProperty = this.unMortgageProperty.bind(this)
    this.buyHouse = this.buyHouse.bind(this)
    this.sellHouse = this.sellHouse.bind(this)
    this.changeButton = this.changeButton.bind(this)

    this.state = {
      dice: [],
      diceSum: 0,
      diceSumComment: '',
      doubles: 0,
      doublesComment: '',
      squareTypeComment: '',
      moveTokenButtonVisible: false,
      // needs to be updated gamestate authentication
      cardButtonVisible: false,
      card: true,
      userNames: [userNames[0][0], userNames[1][0], userNames[2][0], userNames[3][0], userNames[4][0], userNames[5][0], userNames[6][0], userNames[7][0]],
      jailPositions: [0, 0, 0, 0, 0, 0, 0, 0],
      userPropertiesArray: [[], [], [], [], [], [], [], []],
      userMoneyArray: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
      passGoComment: '',
      diceRollButtonVisible: false,
      // needs to be updated gamestate authentication
      endTurnButtonVisible: false,
      buyPropertyComment: '',
      buyPropertyButtonVisible: false,
      rentOwed: 0,
      propertyOwner: '',
      payRentComment: '',
      payRentButtonVisible: false,
      comment: '',
      isBankruptArray: [false, false, false, false, false, false, false, false],
      bankruptcyButtonVisible: false
    }
  }
  // componentWillReceiveProps (nextProps) {
  //   // sock.updateProps({ gameID: nextProps.gameID, pos: nextProps.userPropertiesArray[nextProps.index], index: nextProps.index })
  // }

  componentDidMount () {
    sock.socket.on('yourTurn', (data) => {
      this.setState({ diceRollButtonVisible: true, numOfPlayers: data.numOfPlayers })
      localStorage.setItem('pIndex', data.index)
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
      console.log('diceRoll js update money! socket func! data = ', data)
      let updatedUserMoneyArray = [...this.state.userMoneyArray]
      updatedUserMoneyArray[data.index] = data.money
      this.setState({ userMoneyArray: updatedUserMoneyArray })
      this.props.dispatch(setUserMoney(data.money, data.index))
    })
    sock.socket.on('receive-comment', (comment) => {
      console.log(comment)
      this.setState({comment: comment})
    })
  }

  handleDiceRollButtonClick (doubleDice = 0) {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if (this.props.userPosArray[this.props.index] + die1 + die2 === 30) {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.props.index]} rolled ${die1 + die2}, landing on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass Go. Do Not Collect $200.`,
        doubles: 0,
        doublesComment: '',
        buyPropertyComment: '',
        squareTypeComment: '',
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true,
        endTurnButtonVisible: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} rolled ${die1 + die2}, landing on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass Go. Do Not Collect $200.`)
    } else if (die1 === die2) {
      this.setState({
        diceRollButtonVisible: false
      })
      this.handleMoveTokenButtonClick(doubleDice++, die1, die2)
    } else {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.props.index]} rolled ${die1 + die2}. Move ${die1 + die2} spaces on the board.`,
        doubles: 0,
        doublesComment: '',
        buyPropertyComment: '',
        squareTypeComment: '',
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true,
        endTurnButtonVisible: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} rolled ${die1 + die2}. Move ${die1 + die2} spaces on the board.`)
      this.handleMoveTokenButtonClick(doubleDice, die1, die2)
    }
  }

  handleEndTurnButtonClick () {
    this.setState({
      passGoComment: '',
      chanceComment: '',
      communityComment: '',
      squareTypeComment: '',
      moveTokenButtonVisible: false,
      diceRollButtonVisible: false,
      endTurnButtonVisible: false,
      buyPropertyButtonVisible: false,
      buyPropertyComment: ''
    })
    sock.end({ gameID: this.props.gameID, pos: this.props.userPosArray[this.props.index], index: this.props.index })
  }

  handleMoveTokenButtonClick (doubles, die1, die2) {
    let userPosition = (this.props.userPosArray[this.props.index] + die1 + die2) % 40
    console.log('here')
    this.props.dice(userPosition, this.props.index, true)
    // this.props.dispatch(setUserPositions(userPosition, this.props.index))
    let squareType = rules.PositionType[userPosition]
    if (squareType === 'CHANCE') {
      this.setState({
        cardButtonVisible: true,
        moveTokenButtonVisible: false,
        squareTypeComment: 'You landed on a chance space. Pick a card!',
        card: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on a chance space.`)
    } else if (squareType === 'COMMUNITY_CHEST') {
      this.setState({
        cardButtonVisible: true,
        moveTokenButtonVisible: false,
        squareTypeComment: 'You landed on a community chest space. Pick a card!',
        card: true
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on a community chest space.`)
    } else if (squareType === 'GO_TO_JAIL' || doubles === 3) {
      this.props.dispatch(setUserPositions(10, this.props.index))
      this.setState({
        moveTokenButtonVisible: false,
        endTurnButtonVisible: true
      })
      this.props.dispatch(setUserPositions(userPosition, this.props.index))
    } else if (squareType === 'PROPERTY') {
      if (this.propertyIsOwned(userPosition) === false) {
        this.setState({
          buyPropertyButtonVisible: true,
          moveTokenButtonVisible: false,
          squareTypeComment: 'You landed on an unowned property!',
          endTurnButtonVisible: true
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on an unowned property!`)
        if (doubles > 0) {
          this.setState({
            endTurnButtonVisible: false,
            diceRollButtonVisible: true
          })
        }
      } else {
        // propertyIsOwned returns the ownerNumber
        let propertyOwner = this.propertyIsOwned(userPosition)
        let rentOwed = 0
        let propName = ''
        this.state.userPropertiesArray[propertyOwner].forEach(prop => {
          if (prop.Position === userPosition) {
            propName = prop.PropertyObj.NAME
            rentOwed = prop.PropertyObj.RENT[prop.Houses]
          }
        })
        this.setState({
          payRentButtonVisible: true,
          payRentComment: `You landed on ${propName}. Pay ${rentOwed} to ${this.state.userNames[propertyOwner]}.`,
          endTurnButtonVisible: false,
          moveTokenButtonVisible: false,
          rentOwed: rentOwed,
          propertyOwner: propertyOwner
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on ${propName}. Pay $${rentOwed} to ${this.state.userNames[propertyOwner]}.`)
      }
    } else if (squareType === 'GO') {
      this.setState({
        squareTypeComment: 'You landed on GO. Collect $200!',
        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on GO. Collect $200!`)
      if (!doubles) {
        this.setState({
          endTurnButtonVisible: true
        })
      }
      if (doubles) {
        this.setState({
          diceRollButtonVisible: true
        })
      }
    } else if (squareType === 'FREE_PARKING') {
      this.setState({
        squareTypeComment: 'You landed on Free Parking. Nothing happens.',
        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Free Parking. Nothing happens.`)
      if (!doubles) {
        this.setState({
          endTurnButtonVisible: true
        })
      }
      if (doubles) {
        this.setState({
          diceRollButtonVisible: true
        })
      }
    } else if (squareType === 'JAIL') {
      this.setState({
        squareTypeComment: 'You landed on Jail, but you are just visiting.',
        moveTokenButtonVisible: false
      })
      sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Jail. But ${this.state.userNames[this.props.index]} is just visiting.`)
      if (!doubles) {
        this.setState({
          endTurnButtonVisible: true
        })
      }
      if (doubles) {
        this.setState({
          diceRollButtonVisible: true
        })
      }
    } else if (squareType === 'INCOME_TAX') {
      let updatedUserMoneyArray = [...this.state.userMoneyArray]
      if (updatedUserMoneyArray[this.props.index] < 200) {
        console.log('not enough money to pay income tax')
        checkBankruptcy()
      } else {
        updatedUserMoneyArray[this.props.index] -= 200
      }
      this.props.dispatch(setUserMoney(updatedUserMoneyArray[this.props.index], this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoneyArray[this.props.index], index: this.props.index })
      if (!doubles) {
        this.setState({
          squareTypeComment: 'You landed on Income Tax. Pay $200.',
          userPositions: userPosition,
          userMoneyArray: updatedUserMoneyArray,
          moveTokenButtonVisible: false,
          endTurnButtonVisible: true
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Income Tax. Pay $200.`)
      }
      if (doubles > 0) {
        this.setState({
          squareTypeComment: 'You landed on Income Tax. Pay $200.',
          userPositions: userPosition,
          userMoneyArray: updatedUserMoneyArray,
          moveTokenButtonVisible: false,
          endTurnButtonVisible: false,
          diceRollButtonVisible: true
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Income Tax. Pay $200.`)
      }
    } else if (squareType === 'LUXURY_TAX') {
      let updatedUserMoneyArray = [...this.state.userMoneyArray]
      if (updatedUserMoneyArray[this.props.index] < 100) {
        console.log('not enough money to pay luxury tax')
        checkBankruptcy()
      } else {
        updatedUserMoneyArray[this.props.index] -= 100
      }
      this.props.dispatch(setUserMoney(updatedUserMoneyArray[this.props.index], this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoneyArray[this.props.index], index: this.props.index })

      if (!doubles) {
        this.setState({
          squareTypeComment: 'You landed on Luxury Tax. Pay $100.',
          userMoneyArray: updatedUserMoneyArray,
          moveTokenButtonVisible: false,
          userPositions: userPosition,
          endTurnButtonVisible: true
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Luxury Tax. Pay $100.`)
      }
      if (doubles > 0) {
        this.setState({
          squareTypeComment: 'You landed on Luxury Tax. Pay $100.',
          moveTokenButtonVisible: false,
          userMoneyArray: updatedUserMoneyArray,
          endTurnButtonVisible: false,
          userPositions: userPosition,
          diceRollButtonVisible: true
        })
        sock.socket.emit('comment', `${this.state.userNames[this.props.index]} landed on Luxury Tax. Pay $100.`)
      }
    }
    // this.handleLandOnOrPassGo(oldCurrentUserPosition, userPosition, jail)
  }

  handleLandOnOrPassGo (oldCurrentUserPosition, userPosition, jail) {
    if (!jail) {
      if (userPosition < oldCurrentUserPosition) {
        let updatedUserMoneyArray = [...this.state.userMoneyArray]
        updatedUserMoneyArray[this.props.index] += 200
        this.props.dispatch(setUserMoney(updatedUserMoneyArray[this.props.index], this.props.index))
        sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoneyArray[this.props.index], index: this.props.index })
        this.setState({
          userMoney: updatedUserMoney
        })
      }
    }
  }

  changeButton () {
    this.setState({
      cardButtonVisible: false,
      endTurnButtonVisible: true,
      squareTypeComment: ''
    })
  }

  increaseFunds (value) {
    let updatedUserMoney = this.state.userMoneyArray
    updatedUserMoney[this.props.index] += value
    this.setState({
      userMoney: updatedUserMoney
    })
  }

  reduceFunds (value) {
    let updatedUserMoney = this.state.userMoneyArray
    updatedUserMoney[this.props.index] -= value
    this.setState({
      userMoney: updatedUserMoney
    })
  }

  // this.propertyIsOwned = this.propertyIsOwned.bind(this)
  // this.payRent = this.payRent.bind(this)

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
    let updatedUserMoney = [...this.state.userMoneyArray]
    let doubles = this.state.doubles

    if (updatedUserMoney[currentUser] < rentOwed) {
      this.setState({
        payRentComment: `You owe ${rentOwed}, but only have ${updatedUserMoney[currentUser]}`
      })
      checkBankruptcy()
    } else {
      updatedUserMoney[currentUser] -= rentOwed
      updatedUserMoney[propertyOwner] += rentOwed

      this.props.dispatch(setUserMoney(updatedUserMoney[currentUser], currentUser))
      sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoney[currentUser], index: currentUser })

      this.props.dispatch(setUserMoney(updatedUserMoney[propertyOwner], propertyOwner))
      sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoney[propertyOwner], index: propertyOwner })

      if (!doubles) {
        this.setState({
          userMoneyArray: updatedUserMoney,
          payRentComment: '',
          propertyOwner: '',
          rentOwed: 0,
          payRentButtonVisible: false,
          endTurnButtonVisible: true
        })
      } else if (doubles) {
        this.setState({
          userMoneyArray: updatedUserMoney,
          payRentComment: '',
          propertyOwner: '',
          rentOwed: 0,
          payRentButtonVisible: false,
          endTurnButtonVisible: false,
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

    // if (this.state.userMoneyArray[this.props.index] < 1000) {
    //   this.setState({bankruptcyButtonVisible: true})
    // }

    if (this.state.userMoneyArray[this.props.index] < propertyPrice) {
      this.setState({
        buyPropertyComment: 'You cannot afford this property :(',
        endTurnButtonVisible: true,
        buyPropertyButtonVisible: false,
        squareTypeComment: '',
        moveTokenButtonVisible: false
      })
      if (this.state.doubles) {
        this.setState({
          endTurnButtonVisible: false,
          squareTypeComment: '',
          diceRollButtonVisible: true
        })
      }
    } else {
      let updatedUserMoneyArray = [...this.state.userMoneyArray]
      updatedUserMoneyArray[this.props.index] -= propertyPrice
      this.props.dispatch(setUserMoney(updatedUserMoneyArray[this.props.index], this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: updatedUserMoneyArray[this.props.index], index: this.props.index })

      let updatedUserProperties = [...this.state.userPropertiesArray]

      updatedUserProperties[this.props.index] = propertiesArray
      this.setState({
        buyPropertyComment: `You bought ${newProperty.PropertyObj.NAME}, cost $${newProperty.PropertyObj.PRICE}`,
        userMoneyArray: updatedUserMoneyArray,
        buyPropertyButtonVisible: false,
        endTurnButtonVisible: true,
        squareTypeComment: '',
        moveTokenButtonVisible: false,
        userPropertiesArray: updatedUserProperties
      })
      if (this.state.doubles) {
        this.setState({
          endTurnButtonVisible: false,
          squareTypeComment: '',
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
    if (numberOfPropsNeededForMonopoly === propertiesInGroupCount && this.state.userMoneyArray >= housePrice) {
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
    this.state.userMoneyArray[this.props.index] = 0
    this.state.userPropertiesArray[this.props.index] = []
    this.state.isBankruptArray[this.props.index] = true
  }

  handleMortgageButtonClick (propertyName) {
    console.log('click mortgage button!')
    console.log(this.state.userPropertiesArray[this.props.index])
    // console.log('proerty name', propertyName)
    let usersProperties = [...this.state.userPropertiesArray]
    let updatedUserMoneyArray = [...this.state.userMoneyArray]
    // console.log('before', updatedUserMoneyArray[this.props.index])
    let updatedUserProperties = [...this.state.userPropertiesArray]
    console.log('before', updatedUserProperties )
    updatedUserProperties[this.props.index].forEach((property, i, arr) => {
      if (property.PropertyObj.NAME === propertyName) {
        updatedUserMoneyArray[this.props.index] += property.PropertyObj.MORTGAGE_PRICE
        arr.splice(i,1)
      }
    })
    this.setState({
      userMoneyArray: updatedUserMoneyArray,
      // buyPropertyButtonVisible: false,
      userPropertiesArray: updatedUserProperties
    })
    // console.log('after', updatedUserProperties)
  }

  render () {
    return (
      <div className='user-positions_dice-roll_div'>
        <div className='dice-roll_div'>
          <div className='buttons_div'>
            <div className='dice-roll-btn_div'>
              {this.state.diceRollButtonVisible
                ? <div>
                  <div>{this.props.index === -1 ? null : `${this.state.userNames[this.props.index]} it is your turn. Roll the dice!`}</div>
                  <Button secondary fluid onClick={() => { this.handleDiceRollButtonClick() }}>Roll Dice</Button>
                </div> : null
              }
            </div>
            <div className='move-token-btn_div'>
              {this.state.moveTokenButtonVisible
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleMoveTokenButtonClick() }}>  Move Your Token! </Button>
                </div> : null
              }
            </div>
            {
              this.state.cardButtonVisible ? <Card button={() => { this.changeButton() }} card={this.state.card} number={this.state.numOfPlayers} /> : null
            }
            <div className='buy-property-btn_div'>
              {this.state.buyPropertyButtonVisible
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleBuyPropertyButtonClick() }}>  Buy This Property. </Button>
                </div> : null
              }
            </div>
            <div className='pay-rent-btn_div'>
              {this.state.payRentButtonVisible
                ? <div>
                  <div className='rent-comment'>
                    {this.state.payRentComment}
                  </div>
                  <Button secondary fluid onClick={() => { this.handlePayRentButtonClick() }}>  Pay Rent. </Button>
                </div> : null
              }
            </div>
            <div className='end-turn-btn_div'>
              {this.state.endTurnButtonVisible
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleEndTurnButtonClick() }}>  End Turn. </Button>
                </div> : null
              }
            </div>
            <div className='bankruptcy-btn_div'>
              {this.state.bankruptcyButtonVisible
                ? <div>
                  <Button secondary fluid onClick={() => {this.handleBankruptcyButtonClick() }}> Bankruptcy. </Button>
                </div> : null
              }
            </div>
          </div>
        </div>
        <div className='UserMoney_div'>
          {`Everyone's Money ${[this.state.userMoneyArray]}`}
        </div>
        <div className='Comments_div'>
          <div className='chance-comment_div'>
            {this.state.chanceComment}
          </div>
          <div className='community-comment_div'>
            {this.state.communityComment}
          </div>
          <div className='property-comment_div'>
            {this.state.buyPropertyComment}
          </div>
          <div className='squaretype-comment_div'>
            {this.state.squareTypeComment}
          </div>
        </div>
        <div className='CurrentUser_div'>
          <div className='CurrentUserMoney'>
            {this.props.index === -1 ? null : `You have: $${this.state.userMoneyArray[this.props.index]}`}
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
    userPropertyArray: state.userPropertyArray,
    userMoneyArray: state.userMoneyArray,
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
  userMoneyArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired,
  userPropertyArray: React.PropTypes.array.isRequired,
  userCashArray: React.PropTypes.array.isRequired
}

export default connect(mapStateToProps)(DiceRoll)
