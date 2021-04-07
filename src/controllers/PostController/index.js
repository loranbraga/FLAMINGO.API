const connection = require('../../database/connection')

class PostController {
  async create (request, response) {
    try {
      const { content } = request.body

      if(content.length > 254){
        return response.status(500).send({ message: "Postagem deve conter menos de 255 caracteres" })
      }

      const post = await connection('posts')
        .insert({
          content,
          user_id: request.auth.id,
        }, ['id', 'content'])

      post[0].user = request.auth

      return response.status(200).send(post[0])
    } catch (error) {
      return response.status(500).send({ message: error.message })
    }
  }

  async getAll (request, response) {
    try {

      const posts = await connection('posts')
      .select(['id', 'content', 'user_id'])
      .orderBy([{ column: 'created_at', order: 'desc' }])

      const promises = posts.map( async (post) => {
        const user = await connection
        .select(['id', 'email', 'username', 'name', 'role'])
        .where('id', post.user_id)
        .from('users')
        .first()

        post.user = user
      })

      await Promise.all(promises)
      

      return response.status(200).send(posts)
    } catch (error) {
      return response.status(500).send({ message: error.message })
    }
  }
}

module.exports = new PostController()
