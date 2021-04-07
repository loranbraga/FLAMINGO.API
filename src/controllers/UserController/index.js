const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const connection = require('../../database/connection')

class UserController {
  async register (request, response) {
    try {
      const { name, email, username, password } = request.body

      // Verify if e-mail is already registered
      const existsEmail = await connection
        .select('id', 'name', 'email')
        .where('email', email)
        .from('users')
        .first()

      if (existsEmail) {
        return response.status(400).send({ message: 'E-mail já cadastrado.' })
      }

      const existsUsername = await connection
        .select('id', 'name', 'email')
        .where('username', username)
        .from('users')
        .first()

      if (existsUsername) {
        return response.status(400).send({ message: 'Username não esta disponivel.' })
      }

      // Hashing password
      const hashPassword = await bcrypt.hash(password, 10)

      const user = await connection('users')
        .insert({
          name,
          email,
          username,
          password: hashPassword,
          role: 'basic'
        }, ['id', 'name', 'email', 'username'])


      return response.status(200).send(user[0])
    } catch (error) {
      return response.status(500).send({ message: error.message })
    }
  }

  async authenticate (request, response) {
    try {
      const { email, password } = request.body

      const user = await connection
        .select(['id', 'email', 'username', 'name', 'password', 'role'])
        .where('email', email)
        .from('users')
        .first()

      // Never tell the user if the e-mail is incorrect or the password
      if (!user) {
        return response.status(404).send({ message: 'Email ou senha incorretos.' })
      }

      // Authenticate user password
      const isValidPassword = await bcrypt.compare(password, user.password)

      // Never tell the user if the e-mail is incorrect or the password
      if (!isValidPassword) {
        return response.status(400).send({ message: 'Email ou senha incorretos.' })
      }

      delete user.password
      // Generate JWT Token and return
      const token = await jwt.sign(user, process.env.JWT_SECRET)


      return response.status(200).send({ user,token: token })
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: 'Error' })
    }
  }

  async getUser (request, response) {
    try {
      const { id } = request.params

      const user = await connection
        .select(['id', 'email', 'username', 'role'])
        .where('id', id)
        .from('users')
        .first()

      return response.status(200).send(user)
    } catch (error) {
      return response.status(500).send({ message: 'Error' })
    }
  }
}

module.exports = new UserController()
