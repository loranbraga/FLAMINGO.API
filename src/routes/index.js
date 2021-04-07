const express = require('express')

const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
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

routes.post('/post', function (request, response) {
  return PostController.create(request, response)
})
routes.get('/posts', function (request, response) {
  return PostController.getAll(request, response)
})

module.exports = routes