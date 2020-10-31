
exports.up = function (knex) {
  return knex.schema
    .alterTable('post', function (table) {
      table.renameColumn('author_id', 'user_id')
      table.integer('blog_id').unsigned().references('blog.id')
    })
}

exports.down = function (knex) {
  return knex.schema
    .alterTable('post', function (table) {
      table.renameColumn('user_id', 'author_id')
      table.dropColumn('blog_id')
    })
}
