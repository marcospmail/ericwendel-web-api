const { resolve } = require('path')

const HeroRepository = require('../repositories/heroRepository')
const HeroService = require('../services/heroService')

const filename = resolve(__dirname, '../../database', 'data.json')

const generateInstance = () => {
  const heroRepository = new HeroRepository({
    file: filename
  })

  const heroService = new HeroService({ heroRepository })

  return heroService
}

module.exports = { generateInstance }