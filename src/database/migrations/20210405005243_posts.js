
exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments()
    table.string('content').notNullable()
    table
    .integer('user_id')
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
    table.timestamps()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};