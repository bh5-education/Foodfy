const data = require('../data.json');
const { writeFile, write } = require('fs');

exports.index = (req, res) => {
  return res.render('admin/index', { recipes: data.recipes });
};

exports.create = (req, res) => {
  return res.render('admin/create');
};

exports.post = (req, res) => {
  let id = 1;
  const lastRecipe = data.recipes[data.recipes.length - 1];

  if (lastRecipe) {
    id = lastRecipe.id + 1;
  }

  data.recipes.push({
    id,
    ...req.body,
  });

  writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
    if (error) return res.json({ message: 'Write File' });

    return res.redirect(`/admin`);
  });
};

exports.show = (req, res) => {
  const { id } = req.params;

  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if (id == recipe.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundRecipe) return res.send('Recipe not found');

  return res.render('admin/show', { recipe: data.recipes[index] });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const foundRecipe = data.recipes.find((recipe) => {
    return recipe.id == id;
  });

  if (!foundRecipe) return res.send('Recipe not found');

  return res.render('admin/edit', { recipe: foundRecipe });
};

exports.put = (req, res) => {
  let { id } = req.body;

  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if (id == recipe.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundRecipe) return res.send('Recipe not found');

  const recipe = {
    ...foundRecipe,
    ...req.body,
    id: Number(id),
  };

  data.recipes[index] = recipe;

  writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
    if (error) return res.send('Write file error!');

    return res.redirect(`/admin/recipes/${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const foundRecipe = data.recipes.filter((recipe) => {
    return recipe.id !== id;
  });

  data.recipes = foundRecipe;

  writeFile('data.json', JSON.stringify(data, null, 2), (errror) => {
    if (error) return res.send('Write file errror!');

    return res.redirect('/admin');
  });
};
