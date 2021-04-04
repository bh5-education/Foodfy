const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all();

      const chefs = [];

      for (chef of results.rows) {
        if (chef.avatar) {
          chef.src = `${req.protocol}://${
            req.headers.host
          }${chef.avatar.replace('public', '')}`;
        }
        chefs.push(chef);
      }

      return res.render('chefs/index', { chefs });
    } catch (err) {
      console.error(err);
    }
  },

  create(req, res) {
    return res.render('chefs/create');
  },

  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (!key) return res.send('Please fill all fields');
      }

      let results = await File.create(req.file);
      const file_id = results.rows[0].id;

      results = await Chef.create(req.body, file_id);
      const chef_id = results.rows[0].id;

      return res.redirect(`/admin/chefs/${chef_id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      const chef = results.rows[0];

      results = await Chef.chefRecipes(chef.id);
      const recipes = results.rows;

      results = await File.find(chef.file_id);
      const avatar = results.rows[0];

      avatar.src = `${req.protocol}://${req.headers.host}${avatar.path.replace(
        'public',
        ''
      )}`;

      return res.render('chefs/show', { chef, recipes, avatar });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      const chef = results.rows[0];

      results = await File.find(chef.file_id);
      const avatar = results.rows[0];

      // Com duas barras invertidas é permitido usar a \ como uma string normal
      avatar.src = avatar.path;

      return res.render('chefs/edit', { chef, avatar });
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == '') return res.send('Please fill all fields');
      }

      await Chef.update(req.body);

      if (req.file) {
        path = req.file.path;
        filename = req.file.filename;
      } else {
        path = req.body.avatar_url;
        filename = req.body.avatar_name;
      }

      const params = {
        path,
        filename,
        id: req.body.avatar_id,
      };

      await File.update(params);

      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
      await Chef.delete(req.body.id);
      return res.redirect('/admin/chefs');
    } catch (err) {
      console.error(err);
    }
  },
};
