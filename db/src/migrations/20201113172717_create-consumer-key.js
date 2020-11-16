exports.up = async function (knex) {
  const createConsumerKeyTable = `
    CREATE TABLE IF NOT EXISTS consumer_key (
      id  INT UNSIGNED NOT NULL AUTO_INCREMENT,
      value VARCHAR(40) NOT NULL,

      UNIQUE INDEX unique_value (value),
      PRIMARY KEY (id)
    )
  ;`

  const createNewConsumerKeyIDColumn = `
    ALTER TABLE blog
    ADD consumer_key_id INT UNSIGNED
  ;`

  const alterConsumerKeyID = `
    ALTER TABLE blog
    ADD CONSTRAINT fk_consumer_key_id FOREIGN KEY (consumer_key_id) REFERENCES consumer_key(id)
  ;`

  // create the consumer_key table and the contact with the blog
  await knex.raw(createConsumerKeyTable)
  await knex.raw(createNewConsumerKeyIDColumn)
  await knex.raw(alterConsumerKeyID)
}

exports.down = async function (knex) {
  await knex.raw('DROP TABLE IF EXISTS consumer_key;')
  await knex.raw('ALTER TABLE blog DROP COLUMN consumer_key_id;')
  await knex.raw('ALTER TABLE blog ADD consumer_key VARCHAR(255) NOT NULL;')
}
