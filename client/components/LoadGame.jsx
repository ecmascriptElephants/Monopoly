import React from 'react'
import { Button } from 'semantic-ui-react'
import sock from '../helper/socket'
const LoadGame = (props) => {
  const loadGame = (gameID) => {
    sock.loadGame(gameID)
  }

  return (
    <div>
      {
        props.pendingGames.map((game) => {
          return <Button secondary  onClick={() => { loadGame(game.gameID) }}>  Load {game.gameID} </Button>
        })
      }
    </div>
  )
}

LoadGame.propTypes = {
  pendingGames: React.PropTypes.array.isRequired
}
export default LoadGame
