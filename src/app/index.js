const express = require('express')
const cors = require('cors')

const routes = require('../routes')

class App {
  constructor() {
    this.express = express()
    this.express.use(cors())
    this.middlewares()
    this.routes()
  }
  
  middlewares() {
    this.express.use(express.json())
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new App().express