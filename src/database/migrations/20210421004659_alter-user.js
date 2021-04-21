
exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.string('profile_url');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('profile_url');
  })
};
