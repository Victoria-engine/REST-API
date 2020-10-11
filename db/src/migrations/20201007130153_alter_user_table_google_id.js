
exports.up = function(knex) {
  return knex.schema.alterTable('user', (table) => {
    table.integer('google_id').unsigned().unique()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('user', (table) => {
    table.dropColumn('google_id')
  })
}
