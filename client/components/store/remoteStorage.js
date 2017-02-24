import sock from '../../helper/socket'
export const saveRemoteState = (state) => {
  if (state.playerIndex === state.index) {
    const serializedState = state
    if (state.gameID > 0) {
      sock.socket.emit('update database', { gameID: state.gameID, state: serializedState })
    }
  }
}
