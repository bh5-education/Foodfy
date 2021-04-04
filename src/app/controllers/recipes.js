const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  index(req, res) {
    Recipe.all(null, (recipes) => {
      return res.render('recipes/index', { recipes });
    });
  },

  async create(req, res) {
    const results = await Recipe.chefOptions();

    return res.render('recipes/create', { chefs: results.rows });
  },

  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (!key) return res.send('Please fill all fields');
    }

    let results = await Recipe.create(req.body);
    const recipe_id = results.rows[0].id;

    const savePhotosPromise = req.files.map(async (photo) => {
      results = await File.create(photo);
      const file_id = results.rows[0].id;

      await RecipeFile.create(recipe_id, file_id);
    });

    await Promise.all(savePhotosPromise);

    return res.redirect(`/admin/recipes/${recipe_id}`);
  },

  async show(req, res) {
    try {
      let results = await Recipe.show(req.params.id);
      const recipe = results.rows[0];

      results = await RecipeFile.all(recipe.id);
      const recipe_files = results.rows;

      const photos = [];

      const showPhotosPromise = recipe_files.map(async (recipe_file) => {
        results = await File.find(recipe_file.file_id);
        const photo = results.rows[0];

        photo.src = `${req.protocol}://${req.headers.host}${photo.path.replace(
          'public',
          ''
        )}`;

        photos.push(photo);
      });

      await Promise.all(showPhotosPromise);

      return res.render('recipes/show', { recipe, photos });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      let results = await Recipe.show(req.params.id);
      const recipe = results.rows[0];

      const photos = [];

      results = await RecipeFile.all(recipe.id);

      const showPhotosPromise = results.rows.map(async (recipeFile) => {
        results = await File.find(recipeFile.file_id);
        const photo = results.rows[0];

        photo.src = `${req.protocol}://${req.headers.host}${photo.path.replace(
          'public',
          ''
        )}`;

        photos.push(photo);
      });

      await Promise.all(showPhotosPromise);

      results = await Recipe.chefOptions();
      const chefs = results.rows;

      return res.render('recipes/edit', { recipe, chefs, photos });
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (!key && key != removed_files)
        return res.send('Please fill all fields');
    }

    if (req.files.length != 0) {
      const createPhotosPromise = req.files.map(async (createPhoto) => {
        const results = await File.create(createPhoto);
        const photo = results.rows[0];

        await RecipeFile.create(req.body.id, photo.id);
      });

      await Promise.all(createPhotosPromise);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(`,`);
      const lastIndex = removedFiles.length - 1;
      /**
       * array.Splice
       * lastIndex: index where the method start
       * 1: number of elements to be removed
       * others(optional): elements to add in array
       */
      removedFiles.splice(lastIndex, 1);

      const removedPhotosPromise = removedFiles.map((removedPhoto) => {
        File.delete(removedPhoto);
      });

      await Promise.all(removedPhotosPromise);
    }

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },

  delete(req, res) {
    Recipe.delete(req.body.id, () => {
      return res.redirect('/admin/recipes');
    });
  },
};
