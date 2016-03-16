require('dotenv').config()

// Falcor Configuration
const FalcorServer = require('falcor-hapi')
const Hapi = require('hapi')
const Router = require('./router')

const app = new Hapi.Server()
app.connection({
  host: 'localhost',
  port: 9090,
  routes: {
    cors: {
      credentials: true
    }
  }
})

app.route({
  method: ['GET', 'POST'],
  path: '/model.json',
  handler: FalcorServer.dataSourceRoute((req/*, res*/) => {

    return new Router(req)
  })
})
app.start()
