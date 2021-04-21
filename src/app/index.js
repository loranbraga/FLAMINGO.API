const express = require('express')
const cors = require('cors')
const path = require('path')

const routes = require('../routes')

class App {
  constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
  }
  
  middlewares() {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new App().express