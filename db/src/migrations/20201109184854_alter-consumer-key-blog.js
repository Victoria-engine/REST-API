
exports.up = function (knex) {
  return knex.schema
    .alterTable('blog', (table) => {
      table.string('consumer_id').unique().alter()
      table.renameColumn('consumer_id', 'consumer_key')
    })
}

exports.down = function (knex) {
  return knex.schema
    .alterTable('blog', (table) => {
      table.renameColumn('consumer_key', 'consumer_id')
      table.integer('consumer_id').unique().alter()
    })
}
