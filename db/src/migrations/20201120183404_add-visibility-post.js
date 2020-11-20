
exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE post
    ADD COLUMN visibility ENUM('public', 'private', 'not-listed') DEFAULT 'not-listed'
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE post
    DROP COLUMN visibility
  ;`)
}
