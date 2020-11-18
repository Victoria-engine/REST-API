
exports.up = async function (knex) {
  // gotta drop the column REFERENCE first to add ON DELETE CASCADE
  await knex.raw(`
    ALTER TABLE user
    DROP FOREIGN KEY user_blog_id_foreign
  ;`)

  // now add it back again
  await knex.raw(`
    ALTER TABLE user
    ADD FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE user
    DROP FOREIGN KEY user_blog_id_foreign
  ;`)

  await knex.raw(`
    ALTER TABLE user
    ADD FOREIGN KEY (blog_id) REFERENCES blog(id)
  ;`)
}
