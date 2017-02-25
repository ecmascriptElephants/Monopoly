import React from 'react'
import { Button } from 'semantic-ui-react'
import sock from '../helper/socket'
import { Link } from 'react-router-dom'
const LoadGame = (props) => {
  const loadGame = (gameID) => {
    sock.loadGame({gameID, id: window.localStorage.id, userID: window.localStorage.id})
  }
  console.log(props.load)
  return (
    <div>
      {
        props.pendingGames.map((game, index) => {
          return (props.load ? <Button secondary key={index} onClick={() => { loadGame(game.gameID) }}>
            Load {game.gameID}
          </Button> : <Link to='/board'>
            <Button secondary key={index}>
            Resume Now
             </Button>
          </Link>)
        })
      }
    </div>
  )
}

LoadGame.propTypes = {
  pendingGames: React.PropTypes.array.isRequired
}
export default LoadGame
