
exports.up = function(knex) {
  return knex.schema.createTable('likes', (table) => {
    table.increments()
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('post_id')
      .unsigned()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    table.timestamps()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes')
};