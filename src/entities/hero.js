class Hero {
  constructor({ name, age, power }) {
    this.id = Math.floor(Math.random() * 100 + Date.now())
    this.name = name
    this.age = age
    this.power = power
  }

  isValid() {
    const propertyNames = Object.keys(this)
    const invalidAmount = propertyNames
      .map(property => !!this[property] ? null : `${property} missing`)
      .filter(item => !!item)

    return {
      valid: invalidAmount.length === 0,
      error: invalidAmount
    }
  }
}

module.exports = Hero