const Recipe = require('../models/Recipe');

module.exports = {
  index(req, res) {
    Recipe.all((recipes) => {
      return res.render('recipes/index', { recipes });
    });
  },

  create(req, res) {
    Recipe.chefOptions((chefs) => {
      return res.render('recipes/create', { chefs });
    });
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (!key) return res.send('Please fill all fields');
    }

    Recipe.create(req.body, (recipe) => {
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },

  show(req, res) {
    Recipe.show(req.params.id, (recipe) => {
      return res.render('recipes/show', { recipe });
    });
  },

  edit(req, res) {
    Recipe.show(req.params.id, (recipe) => {
      Recipe.chefOptions((chefs) => {
        return res.render('recipes/edit', { recipe, chefs });
      });
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
        return res.redirect(`/admin/recipes/${req.body.id}`);
      },
    };

    Recipe.update(params);
  },

  delete(req, res) {
    Recipe.delete(req.body.id, () => {
      return res.redirect('/admin/recipes');
    });
  },
};
