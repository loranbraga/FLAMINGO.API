const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const connection = require('../../database/connection')

class UserController {
  async register (request, response) {
    try {
      const { name, email, password } = request.body

      // Verify if e-mail is already registered
      const existsEmail = await connection
        .select('id', 'name', 'email')
        .where('email', email)
        .from('users')
        .first()

      if (existsEmail) {
        return response.status(400).send({ message: 'E-mail is already registered.' })
      }

      // Hashing password
      const hashPassword = await bcrypt.hash(password, 10)

      const role = await connection
        .select('id')
        .where('name', 'user')
        .from('roles')
        .first()

      const user = await connection
        .returning(['id', 'name', 'email'])
        .insert({
          name,
          email,
          password: hashPassword,
          role_id: role.id
        })
        .into('users')

      return response.status(201).send(user[0])
    } catch (error) {
      return response.status(500).send({ message: 'Error' })
    }
  }

  async authenticate (request, response) {
    try {
      const { email, password } = request.body

      const user = await connection
        .select(['id', 'password'])
        .where('email', email)
        .from('users')
        .first()

      // Never tell the user if the e-mail is incorrect or the password
      if (!user) {
        return response.status(404).send({ message: 'E-mail or Password incorrect.' })
      }

      // Authenticate user password
      const isValidPassword = await bcrypt.compare(password, user.password)

      // Never tell the user if the e-mail is incorrect or the password
      if (!isValidPassword) {
        return response.status(400).send({ message: 'E-mail or Password incorrect.' })
      }

      // Generate JWT Token and return
      const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

      return response.status(201).send({ token: token })
    } catch (error) {
      return response.status(500).send({ message: 'Error' })
    }
  }
}

module.exports = new UserController()
