const Chef = require('../models/Chef');

module.exports = {
  index(req, res) {
    Chef.all((chefs) => {
      return res.render('chefs/index', { chefs });
    });
  },

  create(req, res) {
    return res.render('chefs/create');
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (!key) return res.send('Please fill all fields');
    }

    Chef.create(req.body, (chef) => {
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },

  show(req, res) {
    Chef.find(req.params.id, (chef) => {
      Chef.chefRecipes(chef.id, (recipes) => {
        return res.render('chefs/show', { chef, recipes });
      });
    });
  },

  edit(req, res) {
    Chef.find(req.params.id, (chef) => {
      return res.render('chefs/edit', { chef });
    });
  },

  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (!key) return res.send('Please fill all fields');
    }

    const params = {
      ...req.body,
      callback() {
        return res.redirect(`/admin/chefs/${req.body.id}`);
      },
    };

    Chef.update(params);
  },

  delete(req, res) {
    Chef.delete(req.body.id, (message) => {
      if (message.error) {
        return res.send(message.error);
      }
      return res.redirect('/admin/chefs');
    });
  },
};
