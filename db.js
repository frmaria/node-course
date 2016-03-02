// load all modules to sequelize and return to server.js
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db ={};

db.todo = sequelize.import(__dirname + '/models/todo.js');
// sequelize instance
db.sequelize = sequelize;

//sequelize Library
db.Sequelize = Sequelize;

// module.exports only exports one thing, but if I set it equal to an object I can return multiple things
module.exports = db;
