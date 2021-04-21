const express = require('express')

const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')
const jwt = require('express-jwt');
const path =  require('path')


const routes = express.Router()

require('dotenv').config({
  path: process.env.NODE_ENV === 'test'
    ? path.join(__dirname, '../../.env.test')
    : path.join(__dirname, '../../.env')
})

routes.post('/user', function (request, response) {
  return UserController.register(request, response)
})

routes.get('/test', function (request, response) {
  return response.status(200).send({test: true})
})

routes.post('/session', function (request, response) {
  return UserController.authenticate(request, response)
})

routes.put('/admin/:username', function (request, response) {
  return UserController.setAdmin(request, response)
})

// Protected Routes
routes.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], requestProperty: 'auth' }))

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