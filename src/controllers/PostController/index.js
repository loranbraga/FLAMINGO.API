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

  async like (request, response) {
    try {
      const { post_id } = request.params

      const liked = await connection('likes').where('post_id', post_id).where('user_id', request.auth.id).count('id').first()
      if(parseInt(liked.count) > 0){
        await connection('likes').where('post_id', post_id).where('user_id', request.auth.id).del()
        return response.status(200).send()
      }

      await connection('likes').insert({
        post_id,
        user_id: request.auth.id,
      })

      return response.status(200).send()
    } catch (error) {
      return response.status(500).send({ message: error.message })
    }
  }

  async dislike (request, response) {
    try {
      const { post_id } = request.params

      const disliked = await connection('dislikes').where('post_id', post_id).where('user_id', request.auth.id).count('id').first()
      if(parseInt(disliked.count) > 0){
        await connection('dislikes').where('post_id', post_id).where('user_id', request.auth.id).del()
        return response.status(200).send()
      }

      await connection('dislikes').insert({
        post_id,
        user_id: request.auth.id,
      })

      return response.status(200).send()
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

        const likes = await connection('likes').where('post_id', post.id).count('id').first()
        post.likes = parseInt(likes.count)

        const liked = await connection('likes').where('post_id', post.id).where('user_id', request.auth.id).count('id').first()
        post.liked = !!parseInt(liked.count)

        const dislikes = await connection('dislikes').where('post_id', post.id).count('id').first()
        post.dislikes = parseInt(dislikes.count)

        const disliked = await connection('dislikes').where('post_id', post.id).where('user_id', request.auth.id).count('id').first()
        post.disliked = !!parseInt(disliked.count)

        post.user = user
      })

      await Promise.all(promises)
      

      return response.status(200).send(posts)
    } catch (error) {
      return response.status(500).send({ message: error.message })
    }
  }

  async getByUser (request, response) {
    try {

      const { username } = request.params

      const user = await connection
        .select(['id', 'email', 'username', 'role'])
        .where('username', username)
        .from('users')
        .first()

      if(!user){
        return response.status(500).send({ message: 'Usuário não encontrado!' })
      }

      const posts = await connection('posts')
      .select(['id', 'content', 'user_id'])
      .where('user_id', user.id)
      .orderBy([{ column: 'created_at', order: 'desc' }])

      const promises = posts.map( async (post) => {
        const user = await connection
        .select(['id', 'email', 'username', 'name', 'role'])
        .where('id', post.user_id)
        .from('users')
        .first()

        const likes = await connection('likes').where('post_id', post.id).count('id').first()
        post.likes = parseInt(likes.count)

        const liked = await connection('likes').where('post_id', post.id).where('user_id', request.auth.id).count('id').first()
        post.liked = !!parseInt(liked.count)

        const dislikes = await connection('dislikes').where('post_id', post.id).count('id').first()
        post.dislikes = parseInt(dislikes.count)

        const disliked = await connection('dislikes').where('post_id', post.id).where('user_id', request.auth.id).count('id').first()
        post.disliked = !!parseInt(disliked.count)

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
