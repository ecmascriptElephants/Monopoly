module.exports = {
  squareTypeGoToJail: (name, diceSum) => {
    return `${name} rolled ${diceSum}, landing on Go-To-Jail. 
    Go To Jail. Go Directly To Jail. 
    Do Not Pass Go. Do Not Collect $200.`
  },

  tripleDoubles: (name) => {
    return `${name} rolled doubles three times in a row. Go To Jail.
     Go Directly To Jail. Do not Pass Go. Do Not Collect $200.`
  },

  rollDoubles: (name, diceSum) => {
    return `${name} rolled doubles. Move ${diceSum} spaces on the board, and roll again.`
  },

  diceRoll: (name, diceSum) => {
    return `${name} rolled ${diceSum}. Move ${diceSum} spaces on the board.`
  },

  rentInsufficientFunds: (name, rentOwed, cash) => {
    return `${name} owes $${rentOwed}, but only has $${cash}`
  },

  rentPaid: (name, propertyOwner, rent) => {
    return `${name} paid ${propertyOwner} $${rent} in rent.`
  },

  luxuryTaxInsufficientFunds: (name) => {
    return `${name} do not have enough money to pay the $100 luxury tax.`
  },

  luxuryTaxPaid: (name) => {
    return `${name} paid $100 in luxury tax.`
  },

  propertyInsufficientFunds: (name) => {
    return `${name} cannot afford this property :(`
  },

  squareTypeUnownedProperty: (name, propertyName, cost) => {
    return `${name} landed on ${propertyName}, and can buy it for $${cost}.`
  },

  jailDoubles: (name, diceSum) => {
    return `${name} rolled doubles and left jail. Move ${diceSum} spaces.`
  },

  jailNotDoubles: (name) => {
    return `${name} did not roll doubles :(.`
  },

  jailFineInsufficientFunds: (name) => {
    return `${name} cannot afford the $50 fine.`
  },

  incomeTaxInsufficientFunds: (name) => {
    return `${name} does not have enough money to pay the $200 income tax.`
  },

  incomeTaxPaid: (name) => {
    return `${name} paid $200 in income tax.`
  },

  propertyBought: (name, property) => {
    return `${name} bought ${property}!`
  },

  passGo: (name) => {
    return `${name} passed Go. Collect $200!`
  },

  squareTypeChance: (name) => {
    return `${name} landed on a chance space.`
  },

  squareTypeCommunityChest: (name) => {
    return `${name} landed on a community chest space.`
  },

  squareTypeUnownedProperty: (name, property, price) => {
    return `${name} landed on ${property}, and can buy it for $${price}!`
  },

  propertyAlreadyOwned: (name, property) => {
    return `${name} landed on ${property}, but already owns it.`
  },

  propertyIsMortgaged: (name, property) => {
    return `${name} landed on ${property}, but it is mortgaged.`
  },

  rentOwed: (name, property, rent, owner) => {
    return `${name} landed on ${property}. Pay $${rent} to ${owner}.`
  },

  squareTypeGo: (name) => {
    return `${name} landed on GO. Collect $200!`
  },

  squareTypeFreeParking: (name) => {
    return `${name} landed on Free Parking. Nothing happens.`
  },

  squareTypeJail: (name) => {
    return `${name} landed on Jail, but is just visiting.`
  },

  squareTypeIncomeTax: (name) => {
    return `${name} landed on Income Tax. Pay $200`
  },

  squareTypeLuxuryTax: (name) => {
    return `${name} landed on Luxury Tax, Pay $100.`
  }
}
