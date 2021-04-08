const express = require('express')

const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const auth = require('../middlewares/auth')

const routes = express.Router()

routes.post('/register', function (request, response) {
  return UserController.register(request, response)
})

routes.get('/test', function (request, response) {
  return response.status(200).send({test: true})
})

routes.post('/authenticate', function (request, response) {
  return UserController.authenticate(request, response)
})

// Protected Routes
routes.use(auth)

routes.get('/posts', function (request, response) {
  return PostController.getAll(request, response)
})
routes.get('/posts/:username', function (request, response) {
  return PostController.getByUser(request, response)
})
routes.post('/post', function (request, response) {
  return PostController.create(request, response)
})
routes.post('/post', function (request, response) {
  return PostController.create(request, response)
})
routes.delete('/post/:post_id', function (request, response) {
  return PostController.delete(request, response)
})
routes.post('/like/:post_id', function (request, response) {
  return PostController.like(request, response)
})
routes.post('/dislike/:post_id', function (request, response) {
  return PostController.dislike(request, response)
})

module.exports = routes