import React, { Component } from 'react'
import rules from '../static/rules'
import userNames from './user_order'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUserPositions, setIndex } from './store/actionCreators'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleMoveTokenButtonClick = this.handleMoveTokenButtonClick.bind(this)
    this.handleEndTurnButtonClick = this.handleEndTurnButtonClick.bind(this)
    this.handleChanceButtonClick = this.handleChanceButtonClick.bind(this)
    this.handleCommunityButtonClick = this.handleCommunityButtonClick.bind(this)
    this.handleDoubles = this.handleDoubles.bind(this)
    this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)

    this.increaseFunds = this.increaseFunds.bind(this)
    this.reduceFunds = this.reduceFunds.bind(this)
    this.propertyIsOwned = this.propertyIsOwned.bind(this)
    this.buyProperty = this.buyProperty.bind(this)
    this.payRent = this.payRent.bind(this)
    this.mortgageProperty = this.mortgageProperty.bind(this)
    this.unMortgageProperty = this.unMortgageProperty.bind(this)
    this.buyHouse = this.buyHouse.bind(this)
    this.sellHouse = this.sellHouse.bind(this)

    this.state = {
      dice: [],
      diceSum: 0,
      diceSumComment: '',
      doubles: 0,
      doublesComment: '',
      currentUser: 0,
      moveTokenButtonVisible: false,
      // needs to be updated gamestate authentication
      chanceButtonVisible: false,
      communityButtonVisible: false,
      userNames: [userNames[0][0], userNames[1][0], userNames[2][0], userNames[3][0], userNames[4][0], userNames[5][0], userNames[6][0], userNames[7][0]],
      // up to 8 players all starting on GO or position 1
      jailPositions: [0, 0, 0, 0, 0, 0, 0, 0],
      userMoney: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
      userProperties: [[], [], [], [], [], [], [], []],
      // todo: property: [{'PropertyObj': {PropertyObj}, 'Mortaged': false, 'Houses': 0,
      // 'Position': X}],
      passGoComment: '',
      chanceComment: '',
      communityComment: '',
      diceRollButtonVisible: false,
      // needs to be updated gamestate authentication
      endTurnButtonVisible: false
    }
  }

  componentWillReceiveProps (nextProps) {
    sock.updatePos({ gameID: nextProps.gameID, pos: nextProps.userPosArray[nextProps.index], index: nextProps.index })
  }
  componentDidMount () {
    sock.socket.on('yourTurn', (index) => {
      this.setState({ diceRollButtonVisible: true })
      this.props.dispatch(setIndex(index))
      console.log(this.props.index)
    })
  }
  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))

    if (this.props.userPosArray[this.state.index] + die1 + die2 === 30) {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.props.index]} rolled ${die1 + die2}, landing on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass Go. Do Not Collect $200.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true,
        endTurnButtonVisible: false
      })
    } else if (die1 === die2) {
      this.handleDoubles(die1, die2)
      this.setState({
        dice: [die1, die2]
      })
    } else {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.props.index]} rolled ${die1 + die2}. Move ${die1 + die2} spaces on the board.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true,
        endTurnButtonVisible: false
      })
    }
  }

  handleEndTurnButtonClick () {
    this.setState({
      doublesComment: '',
      passGoComment: '',
      chanceComment: '',
      communityComment: '',
      moveTokenButtonVisible: false,
      diceRollButtonVisible: false,
      endTurnButtonVisible: false
    })
    sock.end({ gameID: this.props.gameID, pos: this.props.userPosArray[this.props.index], index: this.props.index })
  }

  handleDoubles (die1, die2) {
    if (this.state.doubles === 0) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.props.index]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`,
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true
      })
    } else if (this.state.doubles === 1) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.props.index]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`,
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true
      })
    } else if (this.state.doubles === 2) {
      // let updatedUserPositions = this.props.userPosArray
      // updatedUserPositions[this.props.index] = 10
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: 3,
        doublesComment: `${this.state.userNames[this.props.index]} rolled doubles three times in a row. Go to Jail. :(`,
        diceRollButtonVisible: false,
        moveTokenButtonVisible: true
        // userPositions: updatedUserPositions
      })
    }
  }

  handleMoveTokenButtonClick () {
    let die1 = this.state.dice[0]
    let die2 = this.state.dice[1]
    let doubles = this.state.doubles
    console.log('diceroll.jsx line 121. Doubles = ', doubles)
    // console.log('handleMoveTokenButtonClick has been invoked!', this.props.userPosArray[this.props.index], die1 + die2)
    // store userPositions array
    let updatedUserPositions = this.props.userPosArray
    // current player's old position
    let oldCurrentUserPosition = updatedUserPositions[this.props.index]
    let jail = this.state.jailPositions[this.props.index]
    // update current player's position based on diceroll
    let updatedCurrentUserPosition = (oldCurrentUserPosition + die1 + die2) % 40
    // let updatedCurrentUserPosition = 2
    // update the userPositions array with the new current players position
    updatedUserPositions[this.props.index] = updatedCurrentUserPosition
    this.props.dispatch(setUserPositions(updatedCurrentUserPosition, this.props.index))

    // if the user lands on Chance space
    if (updatedCurrentUserPosition === 7 || updatedCurrentUserPosition === 22 || updatedCurrentUserPosition === 36) {
      this.setState({
        chanceButtonVisible: true
      })
    } else if (updatedCurrentUserPosition === 2 || updatedCurrentUserPosition === 17 || updatedCurrentUserPosition === 33) {
      // if the user lands on a Community Chest space
      this.setState({
        communityButtonVisible: true
      })
    } else if (updatedCurrentUserPosition === 30 || doubles === 3) {
      // if the user lands on Go-to-jail
      updatedCurrentUserPosition = 10
      updatedUserPositions[this.props.index] = updatedCurrentUserPosition
      let updatedJailPositions = this.state.jailPositions
      jail = 1
      updatedJailPositions[this.props.index] = 1
      this.setState({
        userPositions: updatedUserPositions,
        jailPositions: updatedJailPositions,
        doublesComment: this.state.doublesComment || 'You landed on Go-To-Jail. Go To Jail. Go' +
        ' Directly To Jail. Do' +
        ' Not Pass' +
        ' Go. Do Not Collect $200.',
        moveTokenButtonVisible: false,
        endTurnButtonVisible: true
      })
    }
    if (doubles === 1 || doubles === 2) {
      this.setState({
        userPositions: updatedUserPositions,
        moveTokenButtonVisible: false,
        diceRollButtonVisible: true
      })
      // todo: for now the below works for every other space not specified
    } else {
      this.setState({
        userPositions: updatedUserPositions,
        moveTokenButtonVisible: false,
        endTurnButtonVisible: true
      })
    }
    this.handleLandOnOrPassGo(oldCurrentUserPosition, updatedCurrentUserPosition, jail)
  }

  handleChanceButtonClick () {
    let updatedUserPositions = this.state.userPositions
    let userMoney = this.state.userMoney
    let numCards = 16
    let card = Math.floor((numCards * Math.random()))
    console.log('card', card)
    if (card === 0) {
      this.setState({
        chanceComment: 'ADVANCE TO GO COLLECT $200'
      })
      updatedUserPositions[this.state.currentUser] = 0
      userMoney[this.state.currentUser] += 200
    } else if (card === 1) {
      this.setState({
        chanceComment: 'BANK PAYS YOU DIVIDEND OF $50'
      })
      userMoney[this.state.currentUser] += 50
    } else if (card === 2) {
      this.setState({
        chanceComment: 'GO BACK 3 SPACES'
      })
      updatedUserPositions[this.state.currentUser] -= 3
    } else if (card === 3) {
      this.setState({
        chanceComment: 'ADVANCE TOKEN TO NEAREST UTILITY. IF UNOWNED YOU MAY BUY IT FROM BANK. IF OWNED, THROW DICE AND PAY OWNER A TOTAL TEN TIMES THE AMOUNT THROWN.'
      })
      // 12 & 28
      let buldDis = Math.abs(updatedUserPositions[this.state.currentUser] - 12)
      let waterDis = Math.abs(updatedUserPositions[this.state.currentUser] - 28)
      updatedUserPositions[this.state.currentUser] = (buldDis > waterDis) ? 28 : 12
      // state for properties,
      // if unowned, buy and money enough? UserMoney -= 150; bankMoney += 150
      // if owned, roll,again UserMoney -= diceNum*10; User[own].money += diceNum*10
    } else if (card === 4) {
      this.setState({
        chanceComment: 'GO DIRECTLY TO JAIL. DO NOT PASS GO. DO NOT COLLECT $200.'
      })
      updatedUserPositions[this.state.currentUser] = 10
    } else if (card === 5) {
      this.setState({
        chanceComment: 'PAY POOR TAX OF $15'
      })
      userMoney[this.state.currentUser] -= 15
    } else if (card === 6) {
      this.setState({
        chanceComment: 'ADVANCE TO ST. CHARLES PLACE. IF YOU PASS GO, COLLECT $200.'
      })
      if (updatedUserPositions[this.state.currentUser] > 11) {
        userMoney[this.state.currentUser] += 200
      }
      updatedUserPositions[this.state.currentUser] = 11
    } else if (card === 7) {
      this.setState({
        chanceComment: 'YOU HAVE BEEN ELECTED CHAIRMAN OF THE BOARD. PAY EACH PLAYER $50.'
      })
      // currentUser.money -= 50*num of player;
      userMoney[this.state.currentUser] -= 50 * 7
      userMoney.forEach((money, player, userMoney) => {
        if (player !== this.state.currentUser) {
          userMoney[player] += 50
        }
      })
    } else if (card === 8) {
      this.setState({
        chanceComment: 'ADVANCE TOKEN TO THE NEAREST RAILROAD AND PAY OWNER TWICE THE RENTAL TO WHICH HE IS OTHERWISE ENTITLED. IF RAILROAD IS UNOWNED, YOU MAY BUY IT FROM THE BANK.'
      })
      if (updatedUserPositions[this.state.currentUser] === 7) {
        updatedUserPositions[this.state.currentUser] = 15
      } else if (updatedUserPositions[this.state.currentUser] === 22) {
        updatedUserPositions[this.state.currentUser] = 25
      } else {
        updatedUserPositions[this.state.currentUser] = 5
      }
      //  PAY OWNER TWICE THE RENTAL, IF UNOWNED, BUY
    } else if (card === 9) {
      this.setState({
        chanceComment: 'TAKE A RIDE ON THE READING. IF YOU PASS GO COLLECCT $200'
      })
      // TAKE A RIDE ON THE READING. IF YOU PASS GO COLLECCT $200
      if (updatedUserPositions[this.state.currentUser] > 5) {
        userMoney[this.state.currentUser] += 200
      }
      updatedUserPositions[this.state.currentUser] = 5
    } else if (card === 10) {
      this.setState({
        chanceComment: 'ADVANCE TOKEN TO THE NEAREST RAILROAD AND PAY OWNER TWICE THE RENTAL TO WHICH HE IS OTHERWISE ENTITLED. IF RAILROAD IS UNOWNED, YOU MAY BUY IT FROM THE BANK.'
      })
      if (updatedUserPositions[this.state.currentUser] === 7) {
        updatedUserPositions[this.state.currentUser] = 15
      } else if (updatedUserPositions[this.state.currentUser] === 22) {
        updatedUserPositions[this.state.currentUser] = 25
      } else {
        updatedUserPositions[this.state.currentUser] = 5
      }
      //  PAY OWNER TWICE THE RENTAL, IF UNOWNED, BUY
    } else if (card === 11) {
      this.setState({
        chanceComment: 'TAKE A WALK ON THE BOARD WALK. ADVANCE TOKEN TO BOARD WALK'
      })
      updatedUserPositions[this.state.currentUser] = 39
      // buy house or pay rent
    } else if (card === 12) {
      this.setState({
        chanceComment: 'YOUR BUILDING AND LOAN MATURES. COLLECT $150'
      })
      userMoney[this.state.currentUser] += 150
    } else if (card === 13) {
      this.setState({
        chanceComment: 'ADVANCE TO ILLINOIS AVE'
      })
      updatedUserPositions[this.state.currentUser] = 24
    } else if (card === 14) {
      this.setState({
        chanceComment: 'MAKE GENERAL REPAIRS ON ALL YOUR PROPERTY. FOR EACH HOUSE PAY $25. FOR EACH HOTEL PAY $100.'
      })
    } else {
      this.setState({
        chanceComment: 'GET OUT OF JAIL FREE'
      })
      // current user jailCard = true
      numCards = 15
    }
    this.setState({
      chanceButtonVisible: false
    })
  }

  handleCommunityButtonClick () {
    let updatedUserPositions = this.state.userPositions
    let userMoney = this.state.userMoney
    let numCards = 16
    let card = Math.floor((numCards * Math.random()))
    // const card = 3
    if (card === 0) {
      this.setState({
        communityComment: 'BANK ERROR IN YOUR FAVOR COLLECT $200'
      })
      userMoney[this.state.currentUser] += 200
    } else if (card === 1) {
      this.setState({
        communityComment: 'FROM SALE OF STOCK YOU GET $45'
      })
      userMoney[this.state.currentUser] += 45
    } else if (card === 2) {
      this.setState({
        communityComment: 'PAY HOSPITAL $100'
      })
      userMoney[this.state.currentUser] -= 100
    } else if (card === 3) {
      this.setState({
        communityComment: 'COLLECT $50 FROM EVERY PLAYER'
      })
      userMoney[this.state.currentUser] += 50 * 7
      userMoney.forEach((money, player, userMoney) => {
        if (player !== this.state.currentUser) {
          userMoney[player] -= 50
        }
      })
    } else if (card === 4) {
      this.setState({
        communityComment: 'DOCTOR"S FEE PAY $50'
      })
      userMoney[this.state.currentUser] -= 50
    } else if (card === 5) {
      this.setState({
        communityComment: 'YOU INHERIT $100'
      })
      userMoney[this.state.currentUser] += 100
    } else if (card === 6) {
      this.setState({
        communityComment: 'ADVANCE TO GO COLLECT $200'
      })
      updatedUserPositions[this.state.currentUser] = 0
      userMoney[this.state.currentUser] += 200
    } else if (card === 7) {
      this.setState({
        communityComment: 'PAY SCHOOL TAX OF $150'
      })
      userMoney[this.state.currentUser] -= 150
    } else if (card === 8) {
      this.setState({
        communityComment: 'XMAS FUND MATURES COLLECT $100'
      })
      userMoney[this.state.currentUser] += 100
    } else if (card === 9) {
      this.setState({
        communityComment: 'RECEIVE FOR SERVICES $25'
      })
      userMoney[this.state.currentUser] -= 25
    } else if (card === 10) {
      this.setState({
        communityComment: 'INCOME TAX REFUND COLLECT $20'
      })
      userMoney[this.state.currentUser] += 20
    } else if (card === 11) {
      this.setState({
        communityComment: 'LIFE INSURANCE MATURES COLLECT $100'
      })
      userMoney[this.state.currentUser] += 100
    } else if (card === 12) {
      this.setState({
        communityComment: 'GO TO JAIL GO DIRECTLY TO JAIL DO NOT PASS GO DO NOT COLLECT $200'
      })
      updatedUserPositions[this.state.currentUser] = 10
    } else if (card === 13) {
      this.setState({
        communityComment: 'YOU HAVE WON SECOND PRIZE IN A BEAUTY CONTEST COLLECT $10'
      })
      userMoney[this.state.currentUser] += 10
    } else if (card === 14) {
      this.setState({
        communityComment: 'YOU ARE ASSESSED FOR STREET REPAIRS $40 PER HOUSE $115 PER HOTEL'
      })
      // STREET REPAIRS $40 PER HOUSE $115 PER HOTEL'
    } else {
      this.setState({
        communityComment: 'GET OUT OF JAIL FREE'
      })
      // current user jailCard = true
      numCards = 15
    }
    this.setState({
      communityButtonVisible: false
    })
  }

  handleAddDiceRollToUserPosition (die1, die2, doubles) {
    let updatedPosition = (this.props.userPosArray[this.props.index] + die1 + die2) % 40
    this.props.dispatch(setUserPositions(updatedPosition, this.props.index))
  }

  handleLandOnOrPassGo (oldCurrentUserPosition, updatedCurrentUserPosition, jail) {
    console.log('handleLandOnOrPassGo')
    if (!jail) {
      if (updatedCurrentUserPosition < oldCurrentUserPosition) {
        console.log('dice_roll.jsx line 278, handleLandOnOrPassGo function has been invoked.' +
          ' Jail = ', jail)
        let updatedUserMoney = this.state.userMoney
        updatedUserMoney[this.props.index] += 200
        this.setState({
          userMoney: updatedUserMoney
        })
      }
    }
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

  // this.propertyIsOwned = this.propertyIsOwned.bind(this)
  // this.payRent = this.payRent.bind(this)

  propertyIsOwned (propertyPosition) {
    let ownership = false
    this.state.userProperties.forEach((propertyArray) => {
      propertyArray.forEach((propertyObj) => {
        if (propertyObj.Position === propertyPosition) ownership = true
      })
    })
    return ownership
  }

  payRent (propertyPosition) {
    // let propertyOwner = figure out who owns the property
    let updatedUserMoney = this.state.userMoney
    // updatedUserMoney[this.props.index] -= amount of rent
    // updatedUserMoney[this.state.propertyOwner] += amount of rent
    this.setState = {
      userMoney: updatedUserMoney
    }
  }

  buyProperty (propertyPosition) {
    let propertiesArray = this.state.property
    let propertyPrice = 0
    let newProperty = { PropertyObj: {}, Mortgaged: false, Houses: 0, Position: propertyPosition }
    rules.Properties.forEach((property) => {
      if (property.BOARD_POSITION === propertyPosition) {
        propertyPrice = property.PRICE
        newProperty.PropertyObj = property
        propertiesArray.push(newProperty)
      }
    })
    this.reduceFunds(propertyPrice)
    this.setState = {
      property: propertiesArray
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
    this.setState = {
      property: tempProperty
    }
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
    this.setState = {
      property: tempProperty
    }
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
    if (numberOfPropsNeededForMonopoly === propertiesInGroupCount && this.state.money >= housePrice) {
      this.reduceFunds(housePrice)
      this.setState = {
        property: propertiesArray
      }
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
    this.setState = {
      property: propertiesArray
    }
  }

  render () {
    return (
      <div className='user-positions_dice-roll_div'>
        <div className='dice-roll_div'>
          <div className='buttons_div'>
            <div className='dice-roll-btn_div'>
              {this.state.diceRollButtonVisible
                ? <div>
                  <div>{`${this.state.userNames[this.props.index]} it is your turn. Roll the dice!`}</div>
                  <button className='dice-roll-btn' onClick={() => { this.handleDiceRollButtonClick() }}>
                    Roll Dice!
                  </button>
                </div> : null
              }
            </div>
            <div className='move-token-btn_div'>
              {this.state.moveTokenButtonVisible
                ? <div>
                  <div className='dice'>
                    <div className='die1'>
                      {`die1: ${this.state.dice[0]}`}
                    </div>
                    <div className='die2'>
                      {`die2: ${this.state.dice[1]}`}
                    </div>
                    {/* <div>{this.state.diceSum}</div> */}
                    <div>
                      {this.state.diceSumComment}
                    </div>
                  </div>
                  <div className='doubles-comment_div'>{this.state.doublesComment}</div>
                  <button className='move-token-btn' onClick={() => { this.handleMoveTokenButtonClick() }}>
                    Move Your Token!
                  </button>
                </div> : null
              }
            </div>
            <div className='pick-chance-btn_div'>
              {this.state.chanceButtonVisible
                ? <div>
                  <div className='chance_div'>
                    You land on a chance space!
                  </div>
                  <button className='chance-btn' onClick={() => { this.handleChanceButtonClick() }}>
                  Pick a Chance Card!
                  </button>
                </div> : null
              }
            </div>
            <div className='pick-community-btn_div'>
              {this.state.communityButtonVisible
                ? <div>
                  <div className='community_div'>
                    You land on a community chest space!
                  </div>
                  <button className='community-btn' onClick={() => { this.handleCommunityButtonClick() }}>
                  Pick a Community Chest Card!
                  </button>
                </div> : null
              }
            </div>
            <div className='end-turn-btn_div'>
              {this.state.endTurnButtonVisible
                ? <div>
                  <div className='chance-comment_div'>
                    {this.state.chanceComment}
                  </div>
                  <div className='community-comment_div'>
                    {this.state.communityComment}
                  </div>
                  <div className='property-comment_div'>
                    {this.state.communityComment}
                  </div>
                  <button className='end-turn-btn' onClick={() => { this.handleEndTurnButtonClick() }}>
                    End Turn.
                  </button>
                </div> : null
              }
            </div>
            <div className='buy-property-btn_div'>
              {this.state.buyPropertyButtonVisible
                ? <div>
                  <button className='buy-property-btn' onClick={() => { this.handleBuyPropertyButtonClick() }}>
                    Buy this Property!
                  </button>
                </div> : null
              }
            </div>
          </div>

        </div>
        <div className='UserMoney_div'>
          {`Everyone's Money ${[this.state.userMoney]}`}
        </div>
        <div className='CurrentUser_div'>
          <div className='CurrentUserMoney'>
            {`You have: $${this.state.userMoney[this.props.index]}`}
          </div>
          <div className='CurrentUserProperties'>
            {`You have: ${this.state.userProperties[0].length} properties`}
            <div>
              Properties: {this.state.userProperties[0].forEach(e => { return e.PropertyObj.NAME + ' , ' })}
            </div>
          </div>
          {/* <div className='CurrentUserMoney'> */}
          {/* {`You have: $${this.state.userMoney[this.props.index]}`} */}
          {/* </div> */}
        </div>
        <div className='UserPositions'>
          <div className='CurrentUser'>
            {/* {`The next user to roll is ${this.state.userNames[this.props.index]} @
             position ${this.props.userPosArray[this.props.index]}`} */}
          </div>
          <div className='UserPositionsArray'>
            {/* <h5>{`The current state of user positions is ${this.props.userPosArray}`}</h5> */}
            {/* <h5>{`${this.state.userNames[0]} is at position
             ${this.props.userPosArray[0]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[1]} is at position
             ${this.props.userPosArray[1]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[2]} is at position
             ${this.props.userPosArray[2]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[3]} is at position
             ${this.props.userPosArray[3]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[4]} is at position
             ${this.props.userPosArray[4]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[5]} is at position
             ${this.props.userPosArray[5]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[6]} is at position
             ${this.props.userPosArray[6]}`}</h5> */}
            {/* <h5>{`${this.state.userNames[7]} is at position
             ${this.props.userPosArray[7]}`}</h5> */}
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

DiceRoll.propTypes = {
  dice: React.PropTypes.func.isRequired,
  userMoney: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  userPosArray: React.PropTypes.array.isRequired,
  index: React.PropTypes.number.isRequired
}

export default connect(mapStateToProps)(DiceRoll)
