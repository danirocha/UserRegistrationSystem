const  { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hey there' }))

module.exports = routes;