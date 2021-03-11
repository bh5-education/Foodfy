const routes = require('express').Router();

const recipes = require('./controllers/recipes');

routes.get('/', (req, res) => {
  return res.render('index', { recipes });
});
routes.get('/about', (req, res) => {
  return res.render('about');
});
routes.get('/recipes', (req, res) => {
  return res.render('recipes', { recipes });
});
routes.get('/recipes/:index', (req, res) => {
  const index = req.params.index;
  const recipe = recipes[index];
  return res.render('recipe', { recipe });
});

routes.get('/admin', (req, res) => res.redirect('/admin/recipes'));
routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);

routes.post('/admin/recipes', recipes.post);
routes.put('/admin/recipes', recipes.put);
routes.delete('/admin/recipes', recipes.delete);

module.exports = routes;
