import { SET_GAME_ID, SET_USERNAME, SET_USER_ID } from './actions'
const DEFAULT_STATE = {
  gameID: 0,
  username: '',
  userID: ''
}

const setGameID = (state, action) => {
  const newState = {}
  Object.assign(newState, state, { gameID: action.id })
  return newState
}

const setUsername = (state, action) => {
  const newState = {}
  Object.assign(newState, state, {username: action.username})
  return newState
}

const setUserID = (state, action) => {
  const newState = {}
  Object.assign(newState, state, {userID: action.userID})
  return newState
}

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_GAME_ID:
      return setGameID(state, action)

    case SET_USERNAME :
      return setUsername(state, action)

    case SET_USER_ID :
      return setUserID(state, action)

    default:
      return state
  }
}
export default rootReducer
