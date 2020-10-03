
exports.up = function (knex) {
  return knex.schema.alterTable('user', function (table) {
    table.string('email').notNullable().unique().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE `user` DROP COLUMN `email`;')
}
