const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../data/db.json'); // The path to your db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
