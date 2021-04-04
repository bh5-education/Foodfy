const db = require('../../config/db');

module.exports = {
  all(recipe_id) {
    return db.query('SELECT * FROM recipe_files WHERE recipe_id = $1', [
      recipe_id,
    ]);
  },

  create(recipe_id, file_id) {
    return db.query(
      `
      INSERT INTO recipe_files(
        recipe_id,
        file_id
      )
      VALUES($1, $2)
    `,
      [recipe_id, file_id]
    );
  },
};
