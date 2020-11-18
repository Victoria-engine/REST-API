
exports.up = async function (knex) {
  // gotta drop the column REFERENCE first to add ON DELETE CASCADE
  await knex.raw(`
    ALTER TABLE access_token
    DROP FOREIGN KEY access_token_user_id_foreign
  ;`)

  // now add it back again
  await knex.raw(`
    ALTER TABLE access_token
    ADD FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE access_token
    DROP FOREIGN KEY access_token_user_id_foreign
  ;`)

  await knex.raw(`
    ALTER TABLE access_token
    ADD FOREIGN KEY (user_id) REFERENCES user(id)
  ;`)
}
