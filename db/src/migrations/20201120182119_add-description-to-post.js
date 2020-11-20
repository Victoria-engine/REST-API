
exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE post 
    ADD COLUMN description VARCHAR(255) NULL;
  ;`)
}

exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE post
    DROP COLUMN description
  ;`)
}
