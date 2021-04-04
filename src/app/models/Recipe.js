const db = require('../../config/db');
const { date } = require('../lib/utils');

module.exports = {
  all(params, callback) {
    let query = `
      SELECT recipes.* , chefs.name AS chef
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      ORDER BY recipes.title ASC
    `;

    if (params) {
      query = `${query}
        LIMIT ${params}
      `;
    }

    db.query(query, (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows);
    });
  },

  create(data) {
    const query = `
      INSERT INTO recipes (
        title,
        chef_id,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.title,
      data.chef_id,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    return db.query(query, values);
  },

  async show(id) {
    const query = `
      SELECT recipes.*, chefs.name AS chef
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    return db.query(query, [id]);
  },

  async update(data) {
    const query = `
      UPDATE recipes SET 
        title=($1),
        chef_id=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
    `;

    const values = [
      data.title,
      data.chef_id,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },

  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database error ${err}`;

      callback();
    });
  },

  findBy(filter, callback) {
    let query = `
      SELECT recipes.*, chefs.name AS chef
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    `;

    if (filter) {
      query = `${query}
        WHERE title ILIKE '%${filter}%'
      `;
    }

    query = `${query} 
      ORDER BY title ASC
    `;

    db.query(query, (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows);
    });
  },

  showAuthor(id, callback) {
    db.query('SELECT name FROM chefs WHERE id = $1', [id], (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows[0]);
    });
  },

  chefOptions(callback) {
    return db.query('SELECT name, id FROM chefs');
  },
};
