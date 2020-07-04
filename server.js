const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./data')

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server
})

server.get('/', (req, res) => {
    return res.render('index', {recipes})
})

server.get('/about', (req, res) => {
    return res.render('about')
})

server.get('/recipes', (req, res) => {
    return res.render('recipes', {recipes})
})

server.get('/recipes/:index', (req, res) => {
    const index = req.params.index
    const recipe = recipes[index]
    return res.render('recipe', {recipe})
})

server.listen(3000)