import { SET_GAME_ID } from './actions'
const DEFAULT_STATE = {
  gameID: '0'
}

const setGameID = (state, action) => {
  const newState = {}
  Object.assign({}, state, { gameID: action.id })
  return newState
}
const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_GAME_ID:
      return setGameID(state, action)
    default:
      return state
  }
}
export default rootReducer
