
exports.up = function (knex) {
  return knex.schema.alterTable('user', (table) => {
    table.string('google_id').unique().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('user', (table) => {
    table.integer('google_id').unique().alter()
  })
}
