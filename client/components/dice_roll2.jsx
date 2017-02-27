import React, { Component } from 'react'
import rules from '../static/rules'
import userNames from './user_order'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import {
  setIndex,
  setUserProperties,
  setUserJail,
  setCash,
  setUserPositions,
  setMoveToken,
  setDiceRoll,
  setCardButton,
  setEndTurn,
  setLuxury,
  setGoButton,
  setJailPostions,
  setJailRoll,
  setPayFine,
  setFreeCard,
  setBuyProperty,
  setPayRent,
  setIncomeTax,
  setButtons
} from './store/actionCreators'
import { Button, List } from 'semantic-ui-react'
import Card from './Cards'
import Move from './moveToken'
import BuyProperty from './BuyProperty'
import Toast from './toast'
import comments from '../helper/comment'
import Mortgage from './MortgageProperty'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dice: [0, 0],
      diceSum: 0,
      comment: '',
      doubles: 0,
      card: true,
      userPropertiesArray: [[], [], [], [], [], [], [], []],
      userJailFreeCardArray: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      endTurnButtonVisible: false,
      rentOwed: 0,
      propertyOwner: -1,
      isBankruptArray: [false, false, false, false, false, false, false, false],
      jailRollDoublesButtonVisible: false,
      showToast: false
    }
    this.props.dispatch(setButtons())
    this.setStates = this.setStates.bind(this)
    this.increaseFunds = this.increaseFunds.bind(this)
  }

  componentDidMount () {
    sock.socket.on('yourTurn', (data) => {
      if (this.props.bankruptcyButton === false) {
        window.localStorage.setItem('pIndex', data.index)
        this.props.dispatch(setIndex(data.index))
        this.props.dispatch(setDiceRoll(true))
        this.props.dispatch(setPayFine(true))
        this.props.dispatch(setJailRoll(true))
        this.props.dispatch(setFreeCard(true))
        this.setState({
          numOfPlayers: data.numOfPlayers
        })
        sock.socket.emit('comment', { gameID: this.props.gameID, comment: `It is ${this.props.username}'s turn.` })
      } else {
        this.props.dispatch(setEndTurn(true))
        this.setState({
          comment: 'You bankrupted... Please hit the end button to pass to other players',
          showToast: true
        })
      }
    })

    sock.socket.on('update money', (data) => {
      this.props.dispatch(setCash(data.money, data.index))
    })
    sock.socket.on('receive-comment', (comment) => {
      this.setState({ comment, showToast: true })
    })
  }

  handleDiceRollButtonClick () {
    this.props.dispatch(setButtons())
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if (this.props.jailPositions[this.props.index]) {
      if (die1 === die2) {
        let updatedJailPositionsArray = [...this.props.jailPositions]
        updatedJailPositionsArray[this.props.index] = 0
        this.props.dispatch(setMoveToken(true))
        this.props.dispatch(setJailRoll(false))
        this.setState({
          comment: `You rolled doubles and left jail. Move ${die1 + die2} spaces.`,
          showToast: true
        })
      } else {
        let updatedJailPositionsArray = [...this.props.jailPositions]
        updatedJailPositionsArray[this.props.index] += 1
        this.dispatch(setEndTurn(true))
        this.dispatch(setJailRoll(false))
        this.setState({
          comment: 'You did not roll doubles :(.'
        })
      }
    } else {
      let doubles = 0
      if (die1 === die2) {
        doubles = this.state.doubles + 1
        this.setState({ comment: comments.rolledDoubles(), showToast: true })
      }
      this.props.dispatch(setDiceRoll(false))
      this.props.dispatch(setMoveToken(true))
      this.setState({
        diceSum: die1 + die2,
        doubles: doubles
      })
    }
  }

  handleEndTurnButtonClick () {
    this.props.dispatch(setEndTurn(false))
    sock.end({ gameID: this.props.gameID, pos: this.props.userPosArray[this.props.index], index: this.props.index })
  }

  setStates (obj) {
    this.setState(obj)
  }

  handleGoButtonClick () {
    this.props.dispatch(setCash(200, this.props.index))
    sock.updateMoney({
      gameID: this.props.gameID,
      money: 200,
      index: this.props.index
    })

    let doubles = this.state.doubles
    this.props.dispatch(setEndTurn(!doubles))
    this.props.dispatch(setGoButton(false))
    this.props.dispatch(setDiceRoll(!!doubles))
  }

  handleCardButtonClick () {
    let doubles = this.state.doubles
    this.props.dispatch(setEndTurn(!doubles))
    this.props.dispatch(setCardButton(false))
  }

  increaseFunds (value) {
    this.props.dispatch(setCash(value, this.props.index))
  }

  reduceFunds (value) {
    this.props.dispatch(setCash(-value, this.props.index))
  }

  handlePayRentButtonClick () {
    let currentUser = this.props.index
    let propertyOwner = this.state.propertyOwner
    let rentOwed = this.state.rentOwed
    let updatedUserMoney = this.props.userCashArray[currentUser]
    let doubles = this.state.doubles
    if (updatedUserMoney < rentOwed) {
      const comment = comments.LowOnRent(rentOwed, updatedUserMoney[currentUser])
      this.setState({
        comment,
        showToast: true
      })
    } else {
      this.props.dispatch(setCash(-rentOwed, currentUser))
      this.props.dispatch(setCash(rentOwed, propertyOwner))
      sock.updateMoney({ gameID: this.props.gameID, money: -rentOwed, index: currentUser })
      sock.updateMoney({ gameID: this.props.gameID, money: rentOwed, index: propertyOwner })
      this.props.dispatch(setPayRent(false))
      this.props.dispatch(setEndTurn(!doubles))
      this.props.dispatch(setDiceRoll(!!doubles))
    }
  }

  handlePayIncomeTaxButtonClick () {
    let doubles = this.state.doubles
    let updatedUserMoneyArray = this.props.userCashArray
    if (updatedUserMoneyArray[this.props.index] < 200) {
      this.props.dispatch(setEndTurn(false))
      this.props.dispatch(setMoveToken(false))
      const comment = comments.cantIncome()
      this.setState({
        comment,
        showToast: true
      })
    } else {
      this.props.dispatch(setCash(-200, this.props.index))
      sock.updateMoney({
        gameID: this.props.gameID,
        money: updatedUserMoneyArray[this.props.index],
        index: this.props.index
      })
      this.props.dispatch(setIncomeTax(false))
      this.props.dispatch(setEndTurn(!doubles))
      this.props.dispatch(setDiceRoll(!!doubles))
    }
  }

  handlePayLuxuryTaxButtonClick () {
    let doubles = this.state.doubles
    let updatedUserMoneyArray = this.props.userCashArray
    if (updatedUserMoneyArray[this.props.index] < 100) {
      this.props.dispatch(setEndTurn(false))
      this.props.dispatch(setMoveToken(false))
      this.setState({
        squareTypeComment: 'You do not have enough money to pay the $100 luxury tax.'
      })
    } else {
      this.props.dispatch(setCash(-100, this.props.index))
      sock.updateMoney({
        gameID: this.props.gameID,
        money: updatedUserMoneyArray[this.props.index],
        index: this.props.index
      })
      this.props.dispatch(setLuxury(false))
      this.props.dispatch(setEndTurn(!doubles))
      this.props.dispatch(setDiceRoll(!!doubles))
    }
  }

  handleJailPayFineButtonClick () {
    if (this.props.userCashArray[this.props.index] < 50) {
      this.setState({
        comment: 'You cannot afford the $50 fine.'
      })
    } else {
      this.props.dispatch(setCash(-50, this.props.index))
      sock.updateMoney({ gameID: this.props.gameID, money: -50, index: this.props.index })
      let updatedJailPositions = [...this.props.jailPositions]
      updatedJailPositions[this.props.index] = 0
      this.props.dispatch(setUserJail(updatedJailPositions[this.props.index], this.props.index))
      this.props.dispatch(setDiceRoll(true))
      this.props.dispatch(setPayFine(false))
      this.props.dispatch(setJailRoll(false))
      this.props.dispatch(setFreeCard(false))
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
              {(this.props.diceRollButton && !this.props.payRent && !this.props.jailPositions[this.props.index])
                ? <div>
                  <div>{this.props.index === -1 ? null : `${this.props.username} it is your turn. Roll the dice!`}</div>
                  <Button secondary fluid onClick={() => { this.handleDiceRollButtonClick() }}>Roll Dice</Button>
                </div> : null
              }
            </div>
            <div className='move-token-btn_div'>
              {this.props.moveTokenButton
                ? <div>
                  <Move
                    setState={this.setStates}
                    doubles={this.state.doubles}
                    diceSum={this.state.diceSum}
                    dice={this.props.dice}
                    userNames={this.state.userNames}
                    propertyIsOwned={this.propertyIsOwned}
                  />
                </div> : null
              }
            </div>
            {
              this.props.cardButton ? <Card button={() => { this.handleCardButtonClick() }}
                card={this.state.card}
                number={this.state.numOfPlayers}
              /> : null
            }
            <div className='buy-property-btn_div'>
              {(this.props.buyPropertyButton && !this.props.setGoButton)
                ? <div>
                  <BuyProperty doubles={this.state.doubles} setState={this.setStates} userNames={this.state.userNames} diceSum={this.state.diceSum} />
                </div> : null
              }
            </div>
            <div className='pass-go-btn_div'>
              {this.props.setGoButton
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleGoButtonClick() }}>  Collect $200. </Button>
                </div> : null
              }
            </div>
            <div className='income-tax-btn_div'>
              {this.props.incomeTaxButton
                ? <div>
                  <Button secondary fluid onClick={() => { this.handlePayIncomeTaxButtonClick() }}>  Pay $200 in income tax. </Button>
                </div> : null
              }
            </div>
            <div className='luxury-tax-btn_div'>
              {this.props.luxuryButton
                ? <div>
                  <Button secondary fluid onClick={() => { this.handlePayLuxuryTaxButtonClick() }}>  Pay $100 in luxury tax. </Button>
                </div> : null
              }
            </div>
            <div className='pay-rent-btn_div'>
              {(this.props.payRent && !this.props.setGoButton)
                ? <div>
                  <div className='rent-comment'>
                    {this.state.payRentComment}
                  </div>
                  <Button secondary fluid onClick={() => { this.handlePayRentButtonClick() }}>  Pay Rent. </Button>
                </div> : null
              }
            </div>
            <div className='end-turn-btn_div'>
              {(this.props.endTurnButton && !this.props.luxuryButton && !this.props.setGoButton && !this.props.incomeTaxButton && !this.props.payRent)
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleEndTurnButtonClick() }}>  End Turn. </Button>
                </div> : null
              }
            </div>
            <div className='bankruptcy-btn_div'>
              {this.props.bankruptcyButton
                ? <div>
                  <Button secondary fluid onClick={() => { this.handleBankruptcyButtonClick() }}> Bankruptcy. </Button>
                </div> : null
              }
            </div>
          </div>
          <div className='jail_div'>
            {(this.props.jailPositions[this.props.index] && !this.props.endTurnButton)
              ? <div>
                <div> {this.props.payFineButton ? 'You are in jail. Pay' +
                  ' $50 to get out immediately, try to roll doubles, or use' +
                  ' a Get Out of Jail Free card' : 'You are in jail :( '} </div>
                <div className='jail-pay-fine-btn_div'>
                  {(this.props.payFineButton && !this.props.endTurnButton)
                    ? <div>

                      <Button secondary fluid onClick={() => {
                        this.handleJailPayFineButtonClick()
                      }}> Pay $50. </Button>
                    </div> : null
                  }
                </div>
                <div className='jail-roll-doubles-btn_div'>
                  {(this.props.jailRollDiceButton && !this.props.endTurnButton)
                    ? <div>
                      <Button secondary fluid onClick={() => {
                        this.handleJailRollDoublesButtonClick()
                      }}> Attempt to roll doubles. </Button>
                    </div> : null
                  }
                </div>
                <div className='jail-free-card-btn_div'>
                  {(this.props.freeCardButton && !this.props.endTurnButton)
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
              Properties : {this.props.index === -1 ? null : <List items={this.props.userPropertiesArray[this.props.index].map((e, index) => {
                return <div key={index}>{e.PropertyObj.NAME} {e.Mortgaged ? null : <Mortgage propertyName={e.PropertyObj.NAME} increaseFunds={this.increaseFunds} /> } {console.log(e)}</div>
              })} />}
            </div>
          </div>
        </div>
        <div className='comment'>
          {this.state.comment}
        </div>
        <Toast message={this.state.comment} show={this.state.showToast} />
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
    userCashArray: state.userCashArray,
    diceRollButton: state.diceRollButton,
    moveTokenButton: state.moveTokenButton,
    cardButton: state.cardButton,
    setGoButton: state.setGoButton,
    endTurnButton: state.endTurnButton,
    incomeTaxButton: state.incomeTaxButton,
    luxuryButton: state.luxuryButton,
    payRent: state.payRent,
    bankruptcyButton: state.bankruptcyButton,
    payFineButton: state.payFineButton,
    jailRollDiceButton: state.jailRollDiceButton,
    buyPropertyButton: state.buyPropertyButton,
    freeCardButton: state.freeCardButton
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
  userCashArray: React.PropTypes.array.isRequired,
  diceRollButton: React.PropTypes.bool.isRequired,
  moveTokenButton: React.PropTypes.bool.isRequired,
  cardButton: React.PropTypes.bool.isRequired,
  setGoButton: React.PropTypes.bool.isRequired,
  endTurnButton: React.PropTypes.bool.isRequired,
  incomeTaxButton: React.PropTypes.bool.isRequired,
  luxuryButton: React.PropTypes.bool.isRequired,
  payRent: React.PropTypes.bool.isRequired,
  bankruptcyButton: React.PropTypes.bool.isRequired,
  payFineButton: React.PropTypes.bool.isRequired,
  jailRollDiceButton: React.PropTypes.bool.isRequired,
  freeCardButton: React.PropTypes.bool.isRequired,
  buyPropertyButton: React.PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(DiceRoll)
