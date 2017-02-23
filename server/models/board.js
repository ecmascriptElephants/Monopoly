const db = require('./db')

const BoardGame = {
  addGame: (state) => {
    return db('game').insert({ 'game-state': state })
    .catch((err) => {
      console.log(err)
    })
  },

  addPlayer: (gameID, playerID) => {
    return db.raw(`INSERT INTO players VALUES (null, ${Number(playerID)}, ${Number(gameID)})`)
  }
}

module.exports = BoardGame
