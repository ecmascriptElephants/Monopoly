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

  cantLux: () => {
    return 'You do not have enough money to pay the $100 luxury tax.'
  },

  LowCash: () => {
    return 'You cannot afford this property :('
  },

  CantPayFine: () => {
    return 'You cannot afford the $50 fine.'
  },

  buyProperty: (propertyName, cost) => {
    return `You landed on ${propertyName}, and can buy it for $${cost}.`
  },

  leftJail: (diceSum) => {
    return `You rolled doubles and left jail. Move ${diceSum} spaces.`
  },

  noDoubles: () => {
    return `You did not roll doubles :(.`
  },

  cant50: () => {
    return `You cannot afford the $50 fine.`
  },

  cantIncome: () => {
    return 'You do not have enough money to pay the $200 income tax.'
  },

  rolledDoubles: () => {
    return 'You rolled Doubles!'
  },

  propertyBought: (name, price) => {
    return `You bought ${name}, cost $${price}`
  },

  boughtBySomeone: (name, propname) => {
    return `${name} bought ${propname}!`
  },

  goComment: () => {
    return 'You passed Gp. Collect $200'
  },

  chance: (name) => {
    return `${name} landed on a chance space.`
  },

  community: (name) => {
    return `${name} landed on a community space.`
  },

  unowned: (name) => {
    return `${name} landed on an unowned property!`
  },

  owned: (user, property, rent, owner) => {
    return `${user} landed on ${property}. Pay $${rent} to ${owner}.`
  },

  rentOwned: (property, rent, owner) => {
    return `You landed on ${property}. Pay ${rent} to ${owner}.`
  },

  landOnGo: () => {
    return 'You landed on Go. Collect $200'
  },

  letItGo: (name) => {
    return `${name} landed on GO. Collect $200!`
  },

  freeParking: () => {
    return 'You landed on Free Parking. Nothing happens.'
  },

  jailLand: () => {
    return 'You landed on Jail, But you are just visiting.'
  },

  incomeTax: () => {
    return 'You landed on Income Tax. Pay $200'
  },

  LuxuryTab: () => {
    return 'You landed on Luxury Tax, Pay $100.'
  }
}
