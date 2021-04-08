const express = require('express')
const cors = require('cors')

const routes = require('../routes')

class App {
  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
    this.express.use(cors())
  }

  middlewares() {
    this.express.use(express.json())
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new App().express