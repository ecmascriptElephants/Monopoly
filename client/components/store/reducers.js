import { SET_GAME_ID, SET_USERNAME } from './actions'
const DEFAULT_STATE = {
  gameID: 0,
  username: ''
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

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_GAME_ID:
      return setGameID(state, action)

    case SET_USERNAME :
      return setUsername(state, action)

    default:
      return state
  }
}
export default rootReducer
