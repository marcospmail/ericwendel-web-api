const http = require('http')
const Hero = require('./entities/hero')

const PORT = 3000
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }

const HeroFactory = require('./factories/heroFactory')
const heroService = HeroFactory.generateInstance()

const routes = {
  '/heroes:get': async (request, response) => {
    const { id } = request.queryString
    const heroes = await heroService.find(id)
    response.write(JSON.stringify({ results: heroes }))

    response.end()
  },
  '/heroes:post': async (request, response) => {

    for await (const data of request) {
      try {
        const item = JSON.parse(data)
        const hero = new Hero(item)

        const { error, valid } = hero.isValid()

        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER)
          response.write(JSON.stringify({ error: error.join(',') }))
          response.end()
        }

        const id = await heroService.create(hero)
        response.writeHead(201, DEFAULT_HEADER)
        response.write(JSON.stringify({ success: 'User created with success!!', id }))
        response.end()
      } catch (err) {
        handleError(response)()
      }
    }
  },
  default: (_, response) => {
    response.write('hello')
    response.end()
  }
}

const handleError = response => {
  return () => {
    response.writeHead(500, DEFAULT_HEADER)
    response.write(JSON.stringify({ error: 'Internal server error' }))
    response.end()
  }
}

const handler = (request, response) => {
  const { url, method } = request
  const [first, route, id] = url.split('/')
  request.queryString = { id: isNaN(id) ? id : Number(id) }

  const key = `/${route}:${method.toLowerCase()}`

  response.writeHead(200, DEFAULT_HEADER)

  const chosen = routes[key]
  return chosen(request, response).catch(handleError(response))
}

http.createServer(handler)
  .listen(PORT, () => console.log('server running at', PORT))

