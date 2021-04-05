exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('username').notNullable()
    table.string('password').notNullable()
    table.enu('role', ['admin', 'basic'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
