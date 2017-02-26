module.exports = {
  DoublesJail: (name, dice) => {
    return `${name} rolled ${dice}, landing on Go-To-Jail. 
    Go To Jail. Go Directly To Jail. 
    Do Not Pass Go. Do Not Collect $200.`
  },
  LandJail: (name) => {
    return `${name} rolled doubles three times in a row. Go To Jail.
     Go Directly To Jail. Do not Pass Go. Do Not Collect $200.`
  },
  RollDoubles: (name, dice) => {
    return `${name} rolled doubles. Move ${dice} spaces on the board, and roll again.`
  },
  DiceRoll: (name, dice) => {
    return `${name} rolled ${dice}. Move ${dice} spaces on the board.`
  },
  LowOnRent: (rentOwed, cash) => {
    return `You owe ${rentOwed}, but only have ${cash}`
  },
  LuxuryTab: () => {
    return 'You do not have enough money to pay the $100 luxury tax.'
  },
  LowCash: () => {
    return 'You cannot afford this property :('
  },
  CantPayFine: () => {
    return 'You cannot afford the $50 fine.'
  }

  buyProperty: (propertyName, cost) {
    return `You landed on ${propertyName}, and can buy it for $${cost}.`
  }
}
