exports.up = function(knex) {
  return knex.schema.createTable('userS', (table) => {
    table.increments()
    table.string('name')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
