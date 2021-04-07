
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
    table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};