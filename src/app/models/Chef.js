const db = require('../../config/db');
const { date } = require('../lib/utils');

module.exports = {
  all(callback) {
    db.query(
      `SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY name ASC`,
      (err, results) => {
        if (err) throw `Database error ${err}`;

        return callback(results.rows);
      }
    );
  },

  create(data, callback) {
    const query = `
      INSERT INTO chefs(
        name,
        avatar_url,
        created_at
      ) VALUES($1, $2, $3)
      RETURNING id
    `;

    const values = [data.name, data.avatar_url, date(Date.now()).iso];

    db.query(query, values, (err, results) => {
      if (err) throw `Database error ${err}`;

      return callback(results.rows[0]);
    });
  },

  find(id, callback) {
    const query = `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
    `;

    db.query(query, [id], (err, results) => {
      if (err) throw `Database error ${err}`;

      return callback(results.rows[0]);
    });
  },

  update(params) {
    const { id, name, avatar_url, callback } = params;

    console.log(params);

    const query = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE id = $3
    `;

    db.query(query, [name, avatar_url, id], (err) => {
      if (err) throw `Database error ${err}`;

      return callback();
    });
  },

  delete(id, callback) {
    db.query(
      'SELECT * FROM recipes WHERE chef_id = $1',
      [id],
      (err, results) => {
        if (err) throw `Database error ${err}`;

        if (results.rows[0]) {
          return callback({
            error: 'This chef has recipes, cannot be deleted',
          });
        }

        db.query('DELETE FROM chefs WHERE id = $1', [id], (err, results) => {
          if (err) throw `Database error ${err}`;

          return callback();
        });
      }
    );
  },

  chefRecipes(chef_id, callback) {
    db.query(
      'SELECT * FROM recipes WHERE chef_id = $1',
      [chef_id],
      (err, results) => {
        if (err) throw `Database error ${err}`;

        return callback(results.rows);
      }
    );
  },
};
