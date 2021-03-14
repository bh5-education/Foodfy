const Recipe = require('../models/Recipe');

module.exports = {
  index(req, res) {
    const limit = 6;

    Recipe.all(limit, (recipes) => {
      return res.render('site/index', { recipes });
    });
  },

  about(req, res) {
    return res.render('site/about');
  },

  show(req, res) {
    Recipe.show(req.params.id, (recipe) => {
      return res.render('site/recipe', { recipe });
    });
  },

  filter(req, res) {
    const { filter } = req.query;

    Recipe.findBy(filter, (recipes) => {
      return res.render('site/recipes', { recipes, filter });
    });
  },
};
