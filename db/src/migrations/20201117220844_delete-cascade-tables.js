
exports.up = async function (knex) {
  // gotta drop the column REFERENCE first to add ON DELETE CASCADE
  await knex.raw(`
    ALTER TABLE blog
    DROP FOREIGN KEY fk_consumer_key_id
  ;`)

  // now add it back again
  await knex.raw(`
    ALTER TABLE blog
    ADD FOREIGN KEY (consumer_key_id) REFERENCES consumer_key(id) ON DELETE CASCADE
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE blog
    DROP FOREIGN KEY fk_consumer_key_id
  ;`)

  await knex.raw(`
    ALTER TABLE blog
    ADD FOREIGN KEY (consumer_key_id) REFERENCES consumer_key(id)
  ;`)
}
