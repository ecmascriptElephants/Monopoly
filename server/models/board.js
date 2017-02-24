const db = require('./db')

const BoardGame = {
  addGame: (state) => {
    return db('game').insert({ 'gstate': state })
    .catch((err) => {
      console.log(err)
    })
  },

  addPlayer: (gameID, playerID) => {
    return db.raw(`INSERT INTO players VALUES (null, ${playerID}, ${gameID})`)
    .catch((err) => {
      console.log(err)
    })
  },

  updateGame: (state) => {
    const obj = JSON.stringify(state.state)
    return db('game')
    .where('id', '=', state.gameID)
    .update({'gstate': obj})
  }
}

module.exports = BoardGame
