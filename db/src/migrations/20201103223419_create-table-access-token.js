
exports.up = function (knex) {
  return knex.schema.createTable('access_token', (table) => {
    table.increments().primary()
    table.string('token', 255).notNullable().unique()
    table.timestamp('expiration_date').notNullable()
    table.integer('user_id').unsigned().references('user.id')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.index(['token'], 'token_index')
  })
}

exports.down = function (knex) {
  return knex.raw('DROP TABLE `access_token`;')
}
