import { createStore } from 'redux'
import rootReducer from './reducers'
import { saveState, loadState } from './localStorage'

const presistedState = loadState()
const store = createStore(
  rootReducer,
  presistedState
  )
store.subscribe(() => {
  saveState(store.getState())
})
export default store
