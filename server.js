
var express = require('express'),
    app = express();


var redis = require('redis'),
    UserController = require('./userController'),
    PostController = require('./postController');

var redisClient = redis.createClient();

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// start page
app.get('/', function(req, res) {
    res.render('pages/index');
});


// posts
app.get('/posts/create/:email', function(req, res) {
    var model = {
        emailAddress: req.params.email
    };
    res.render('pages/createPost', model);
});
app.post('/posts/create', function(req, res) {
    var postCtrl = PostController.create(redisClient);
    postCtrl.createPost(req, res);
});

app.get('/posts', function(req, res) {
  var postCtrl = PostController.create(redisClient);
  postCtrl.getPosts(req, res);
});

app.get('/posts/:key', function(req, res) {
    var postCtrl = PostController.create(redisClient);
    postCtrl.getPost(req, res);
});


//users
app.get('/users/create', function(req, res) {
    res.render('pages/createUser');
});


app.get('/users/:email', function(req, res) {
    var userCtrl = UserController.create(redisClient);
    userCtrl.getUsers(req, res);
});

app.get('/users', function(req, res) {
    var userCtrl = UserController.create(redisClient);
    userCtrl.getUsers(req, res);
});

app.post('/users/create', function(req, res) {
    var userCtrl = UserController.create(redisClient);
    userCtrl.createUser(req, res);
});


app.listen(8080);
console.log('8080 is the magic port');
