
exports.up = function (knex) {
  return knex.schema.alterTable('user', (table) => {
    table.string('password').alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('user', (table) => {
    table.string('password').notNullable().alter()
  })
}
