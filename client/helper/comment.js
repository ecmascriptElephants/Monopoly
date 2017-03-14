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

  jailFineInsufficientFunds: (name) => {
    return `${name} cannot afford the $50 jail fine.`
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

  propertyAlreadyOwned: (name, property) => {
    return `${name} landed on ${property}, but already owns it.`
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

  squareTypeLuxuryTax: (name) => {
    return `${name} landed on Luxury Tax, Pay $100.`
  },

  mortgageProperty: (name, propertyName, amount) => {
    return `${name} mortgaged ${propertyName} for $${amount}.`
  },

  unmortgageProperty: (name, propertyName, amount) => {
    return `${name} unmortgaged ${propertyName} for $${amount}.`
  },

  boughtHouse: (name, propertyName, amount) => {
    return `${name} bought a house on ${propertyName} for $${amount}.`
  },

  boughtHotel: (name, propertyName, amount) => {
    return `${name} bought a hotel on ${propertyName} for $${amount}.`
  },

  soldHouse: (name, propertyName, amount) => {
    return `${name} sold a house on ${propertyName} for $${amount}.`
  },

  soldHotel: (name, propertyName, amount) => {
    return `${name} sold a hotel on ${propertyName} for $${amount}.`
  },

  alreadyHaveHotel: (name, propertyName) => {
    return `${name} already has a hotel on ${propertyName}.`
  },

  buyHouseInsufficientFunds: (name, propertyName, amount, cash) => {
    return `${name} needs $${amount} to buy a house on ${propertyName}, but only has $${cash}.`
  },

  buyHotelInsufficientFunds: (name, propertyName, amount, cash) => {
    return `${name} needs $${amount} to buy a hotel on ${propertyName}, but only has $${cash}.`
  },

  unmortgagePropertyInsufficientFunds: (name, propertyName, amount, money) => {
    return `${name} needs $${amount} in order to unmortgage ${propertyName}, but only has $${money}.`
  }
}
