const db = require('../../config/db');
const { date } = require('../lib/utils');

module.exports = {
  all() {
    return db.query(
      `SELECT chefs.*, count(recipes) AS total_recipes,
      (SELECT path FROM files WHERE id = chefs.file_id) AS avatar
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.name ASC`
    );

    //
  },

  create(data, file_id) {
    const query = `
      INSERT INTO chefs(
        name,
        file_id,
        created_at
      ) VALUES($1, $2, $3)
      RETURNING id
    `;

    const values = [data.name, file_id, date(Date.now()).iso];

    return db.query(query, values);
  },

  find(id) {
    const query = `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
    `;

    return db.query(query, [id]);
  },

  async update({ id, name }) {
    const query = `
      UPDATE chefs SET
        name=($1)
      WHERE id = $2
    `;

    return db.query(query, [name, id]);
  },

  async delete(id) {
    const results = await db.query('SELECT * FROM recipes WHERE chef_id = $1', [
      id,
    ]);

    if (results.rows[0]) {
      return { message: 'This chef has recipes, cannot be deleted' };
    }

    return db.query('DELETE FROM chefs WHERE id = $1', [id]);
  },

  chefRecipes(chef_id) {
    return db.query('SELECT * FROM recipes WHERE chef_id = $1', [chef_id]);
  },
};
