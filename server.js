var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT  = process.env.PORT || 3000;
// var todos = [{
//   id: 1,
//   description: 'Meet mom for lunch',
//   completed: false
// }, {
//   id: 2,
//   description: 'Go to market',
//   completed: false
// }, {
//   id: 3,
//   description: 'Feed the cat',
//   completed: true
// }];
var todos =[];
var todoNextId = 1;

// set up middleware that I can access via req.body
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Todo API Root');
});

app.get('/todos', function(req,res){
  var queryParams = req.query;
  var filteredTodos = todos;
  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }
  res.json(filteredTodos);
});

app.get('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
//   var matchedTodo;
//
//   todos.forEach(function(i){
//     if(todoId === i.id) {
//       matchedTodo = i;
//     }
//   });
// matchedTodo ? res.json(matchedTodo) : res.status(404).send();
});

app.put('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).json({"error": "no todo found"});
  }
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
     validAttributes.completed = body.completed;
   }
  else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
     validAttributes.description = body.description;
   }
  else if (body.hasOwnProperty('description')){
    return res.status(400).send();
  }
  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);

});

app.delete('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  matchedTodo ? (todos = _.without(todos, matchedTodo), res.json(matchedTodo) ) : res.status(404).json({"error": "no todo found"});
});

app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  // trim removes spaces from strings (beg and end only), this way if user types only spaces the conditional will work
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    return res.status(400).send();
  }
  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);

});

app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT + '!');
});
