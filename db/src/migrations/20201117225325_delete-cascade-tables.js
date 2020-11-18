
exports.up = async function (knex) {
  // gotta drop the column REFERENCE first to add ON DELETE CASCADE
  await knex.raw(`
    ALTER TABLE post
    DROP FOREIGN KEY post_blog_id_foreign
  ;`)

  // now add it back again
  await knex.raw(`
    ALTER TABLE post
    ADD FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE post
    DROP FOREIGN KEY post_blog_id_foreign
  ;`)

  await knex.raw(`
    ALTER TABLE blog
    ADD FOREIGN KEY (blog_id) REFERENCES blog(id)
  ;`)
}
