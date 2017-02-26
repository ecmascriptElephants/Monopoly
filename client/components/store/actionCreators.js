import { SET_GAME_ID,
  SET_USERNAME,
  SET_USER_ID,
  SET_USERS_POSITIONS,
  SET_INDEX,
  SET_MESSAGE_ID,
  SET_USERS_PROPERTIES,
  SET_CASH,
  SET_USERS_MONEY,
  SET_USERS_JAIL,
  SET_MYINDEX,
  SET_PLAYERS,
  SET_PLAYER_PROPS,
  SET_DEFAULT_STATE,
  SET_STATE,
  SET_MOVE_TOKEN,
  SET_DICE_ROLL,
  SET_BANKRUPTCY,
  SET_CARD_BUTTON,
  SET_END_TURN,
  SET_FREE_CARD,
  SET_GO_BUTTON,
  SET_INCOME_TAX,
  SET_JAIL_ROLL,
  SET_LUXURY_BUTTON,
  SET_PAY_FINE,
  SET_PAY_RENT,
  SET_JAIL_POSITION
} from './actions'

export function setGameID (id) {
  return {type: SET_GAME_ID, id}
}

export function setUsername (username) {
  return {type: SET_USERNAME, username}
}

export function setUserID (userID) {
  return {type: SET_USER_ID, userID}
}

export function setUserPositions (userPos, index) {
  return {type: SET_USERS_POSITIONS, userPos, index}
}

export function setIndex (index) {
  return {type: SET_INDEX, index}
}

export function setMyIndex (index) {
  return {type: SET_MYINDEX, index}
}

export function setMessageID (id) {
  return {type: SET_MESSAGE_ID, id}
}

export function setUserProperties (userProperties, index) {
  return {type: SET_USERS_PROPERTIES, userProperties, index}
}

export function setCash (cash, index) {
  return {type: SET_CASH, cash, index}
}

export function setUserMoney (userMoney, index) {
  return {type: SET_USERS_MONEY, userMoney, index}
}

export function setUserJail (userJail, index) {
  return {type: SET_USERS_JAIL, userJail, index}
}

export function setPlayers (playersArray) {
  return {type: SET_PLAYERS, playersArray}
}

export function setPlayerProps (playerProps, index) {
  return {type: SET_PLAYER_PROPS, playerProps, index}
}

export function setDefaultState () {
  return {type: SET_DEFAULT_STATE}
}

export function setState (state) {
  return {type: SET_STATE, state}
}

export function setMoveToken (bool) {
  return {type: SET_MOVE_TOKEN, bool}
}

export function setDiceRoll (bool) {
  return {type: SET_DICE_ROLL, bool}
}

export function setBankruptcy (bool) {
  return {type: SET_BANKRUPTCY, bool}
}

export function setCardButton (bool) {
  return {type: SET_CARD_BUTTON, bool}
}

export function setEndTurn (bool) {
  return {type: SET_END_TURN, bool}
}

export function setFreeCard (bool) {
  return {type: SET_FREE_CARD, bool}
}

export function setGoButton (bool) {
  return {type: SET_GO_BUTTON, bool}
}

export function setIncomeTax (bool) {
  return {type: SET_INCOME_TAX, bool}
}

export function setJailRoll (bool) {
  return {type: SET_JAIL_ROLL, bool}
}

export function setLuxury (bool) {
  return {type: SET_LUXURY_BUTTON, bool}
}

export function setPayFine (bool) {
  return {type: SET_PAY_FINE, bool}
}

export function setPayRent (bool) {
  return {type: SET_PAY_RENT, bool}
}

export function setJailPostions (index, value) {
  return {type: SET_JAIL_POSITION, index, value}
}

