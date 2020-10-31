
exports.up = function(knex) {
  return knex.schema.alterTable('user', (table) => {
    table.integer('blog_id').unsigned().references('blog.id')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('user', (table) => {
    table.integer('blog_id').unique().alter()
  })
}
