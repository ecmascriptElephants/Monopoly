import axios from 'axios'
import sock from '../../helper/socket'
export const saveRemoteState = (state) => {
  if (state.playerIndex === state.index) {
    const serializedState = state
    sock.socket.emit('update database', {gameID: state.gameID, state: serializedState})
  }
}
