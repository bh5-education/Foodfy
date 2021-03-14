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

  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        image,
        title,
        chef_id,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      data.image,
      data.title,
      data.chef_id,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows[0]);
    });
  },

  show(id, callback) {
    const query = `
      SELECT recipes.*, chefs.name AS chef
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    db.query(query, [id], (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows[0]);
    });
  },

  update(params) {
    const { callback } = params;

    const query = `
      UPDATE recipes SET 
        image=($1),
        title=($2),
        chef_id=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
    `;

    const values = [
      params.image,
      params.title,
      params.chef_id,
      params.ingredients,
      params.preparation,
      params.information,
      params.id,
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Database error ${err}`;

      callback();
    });
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
    db.query('SELECT name, id FROM chefs', (err, results) => {
      if (err) throw `Database error ${err}`;

      callback(results.rows);
    });
  },
};
