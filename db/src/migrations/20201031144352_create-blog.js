
exports.up = function (knex) {
  return knex.schema
    .createTable('blog', function (table) {
      table.increments().primary()
      table.string('title', 255).notNullable()
      table.string('description', 255).notNullable()
      table.integer('consumer_id').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE `blog`;')
}
