const routes = require('express').Router();
const multer = require('./app/middleware/multer');

const site = require('./app/controllers/site');
const chefs = require('./app/controllers/chefs');
const recipes = require('./app/controllers/recipes');
const Chef = require('./app/models/Chef');

// Site

routes.get('/', (req, res) => res.redirect('/home'));
routes.get('/home', site.index);
routes.get('/about', site.about);
routes.get('/recipes', site.filter);
routes.get('/recipes/:id', site.show);

routes.get('/chefs', (req, res) => {
  Chef.all((chefs) => {
    return res.render('site/chefs', { chefs });
  });
});

// Recipes

routes.get('/admin', (req, res) => res.redirect('/admin/recipes'));

routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);

routes.post('/admin/recipes', multer.array('photos', 5), recipes.post);
routes.put('/admin/recipes', multer.array('photos', 5), recipes.put);
routes.delete('/admin/recipes', recipes.delete);

// Chefs

routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', chefs.create);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);

routes.post('/admin/chefs', multer.single('avatar'), chefs.post);
routes.put('/admin/chefs', multer.single('avatar'), chefs.put);
routes.delete('/admin/chefs', chefs.delete);

module.exports = routes;
