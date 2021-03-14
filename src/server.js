const express = require('express');
const { configure } = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set('view engine', 'njk');

configure('src/app/views', {
  express: server,
  noCache: true,
  autoescape: false,
});

server.listen(3333, () => console.log('> Server running'));
