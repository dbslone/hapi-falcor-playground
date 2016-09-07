// Falcor Configuration
import FalcorHandler from 'falcor-hapi'
import Hapi from 'hapi'
import routes from './routes'

const app = new Hapi.Server({
  debug: {
    request: ['error', 'read', 'database']
  }
})
app.connection({
  host: 'localhost',
  port: 9090,
  routes: {
    cors: {
      additionalHeaders: ['X-AUTH-ENTITY', 'X-AUTH-ID', 'X-AUTH-TOKEN'],
      credentials: true,
      origin: ['*']
    }
  }
})

app.register(require('inert'), (err) => {

  if (err) {
    throw err
  }

  app.route({
    method: 'GET',
    path: '/home',
    handler: (request, reply) => {
      reply.file('./public/home.html')
    }
  })
})

app.register(FalcorHandler, (err) => {

  if (err) {
    console.error('Failed to load plugin: ', err)
  }

  app.route({
    method: ['GET', 'POST'],
    path: '/model.json',
    handler: {
      falcor: {
        routes
      }
    }
  })

  app.start()
})
