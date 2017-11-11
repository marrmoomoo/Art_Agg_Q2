
exports.up = function(knex, Promise) {
  return knex.schema.createTable('behance_accounts', function(table){
    table.increments();
    table.string('behance_username').notNullable().defaultTo('');
    table.integer('user_id').references('id').inTable('users').index().onDelete('cascade');
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('behance_accounts')
};
