const express = require('express')

const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')

const routes = express.Router()

routes.post('/register', function (request, response) {
  return UserController.register(request, response)
})

routes.post('/authenticate', function (request, response) {
  return UserController.authenticate(request, response)
})

// Protected Routes
routes.use(auth)

routes.get('/user/:id', function (request, response) {
  return UserController.getUser(request, response)
})

module.exports = routes