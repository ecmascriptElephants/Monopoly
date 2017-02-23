import {
  SET_GAME_ID,
  SET_USERNAME,
  SET_USER_ID,
  SET_USERS_POSITIONS,
  SET_INDEX,
  SET_MESSAGE_ID,
  SET_USERS_PROPERTIES,
  SET_USERS_MONEY,
  SET_MYINDEX,
  SET_CASH,
  SET_PLAYERS,
  SET_PLAYER_PROPS
} from './actions'
const DEFAULT_STATE = {
  gameID: 0,
  username: '',
  userID: '',
  userPosArray: [0, 0, 0, 0, 0, 0, 0, 0],
  playerIndex: -1,
  index: -1,
  messageID: 0,
  players: [],
  userPropertyArray: [[], [], [], [], [], [], [], []],
  userCashArray: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
  userMoneyArray: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500]
}

const setGameID = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { gameID: action.id })
  return newState
}

const setUsername = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { username: action.username })
  return newState
}

const setUserID = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { userID: action.userID })
  return newState
}

const setIndex = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { index: action.index })
  return newState
}

const setPlayerIndex = (state, action) => {
  console.log('setting up player index in redux')
  const newState = {}
  Object.assign(newState, state, { playerIndex: action.index })
  return newState
}

const setUserPosition = (state, action) => {
  let newArr = [...state.userPosArray.slice(0, action.index),
    action.userPos,
    ...state.userPosArray.slice(action.index + 1)]
  const newState = {}
  Object.assign(newState, state, { userPosArray: newArr })
  return newState
}

const setMessageID = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { messageID: action.messageID })
  return newState
}

const setUserProperties = (state, action) => {
  let newArr = [...state.userPropertyArray.slice(0, action.index),
    action.userProperties,
    ...state.userPropertyArray.slice(action.index + 1)]
  const newState = {}
  Object.assign(newState, state, { userPropertyArray: newArr })
  return newState
}

const setUserCash = (state, action) => {
  let cash = state.userCashArray[action.index] + action.cash
  let newArr = [...state.userCashArray.slice(0, action.index),
    cash,
    ...state.userCashArray.slice(action.index + 1)]
  const newState = {}
  Object.assign(newState, state, { userCashArray: newArr })
  return newState
}

const setUserMoney = (state, action) => {
  let newArr = [...state.userMoneyArray.slice(0, action.index),
    action.userMoney,
    ...state.userMoneyArray.slice(action.index + 1)]
  const newState = {}
  Object.assign(newState, state, { userMoneyArray: newArr })
  return newState
}

const setPlayersArray = (state, action) => {
  let newState = {}
  let newArray = [...action.playersArray]
  Object.assign(newState, state, { players: newArray })
  return newState
}

const setPlayerProps = (state, action) => {
  let player = state.players[action.index]
  player.userPosition = action.playerProps
  let newArr = [...state.players.slice(0, action.index),
    player,
    ...state.players.slice(action.index + 1)]
  const newState = {}
  Object.assign(newState, state, { players: newArr })
  return newState
}

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_GAME_ID:
      return setGameID(state, action)

    case SET_USERNAME:
      return setUsername(state, action)

    case SET_USER_ID:
      return setUserID(state, action)

    case SET_USERS_POSITIONS:
      return setUserPosition(state, action)

    case SET_INDEX:
      return setIndex(state, action)

    case SET_MESSAGE_ID:
      return setMessageID(state, action)

    case SET_USERS_PROPERTIES:
      return setUserProperties(state, action)

    case SET_CASH:
      return setUserCash(state, action)

    case SET_USERS_MONEY:
      return setUserMoney(state, action)

    case SET_MYINDEX:
      return setPlayerIndex(state, action)

    case SET_PLAYERS:
      return setPlayersArray(state, action)

    case SET_PLAYER_PROPS:
      return setPlayerProps(state, action)

    default:
      return state
  }
}
export default rootReducer
