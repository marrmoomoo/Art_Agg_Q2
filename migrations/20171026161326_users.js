
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.string('username').notNullable().defaultTo('');
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.string('fname').notNullable().defaultTo('');
    table.string('lname').notNullable().defaultTo('');
    table.string('city').notNullable().defaultTo('');
    table.string('state').notNullable().defaultTo('');
    table.string('bio').notNullable().defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
