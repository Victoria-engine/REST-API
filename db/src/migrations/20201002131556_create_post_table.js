
exports.up = function (knex) {
  return knex.schema
    .createTable('post', function (table) {
      table.increments().primary()
      table.string('title', 255).notNullable()
      table.text('text').notNullable()
      table.integer('author_id').unsigned().references('user.id')

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE `post`;')
}
