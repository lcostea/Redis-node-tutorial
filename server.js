
var express = require('express'),
    url = require('url'),
    app = express();
    
    
var redis = require('redis'),
    User = require('./User'),
    UserRepository = require('./userRepository');

var redisClient = redis.createClient();

app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/posts', function(req, res) {
    res.render('pages/posts');
});

app.get('/user/:email', function(req, res) {
    var userRep = UserRepository.create(redisClient);
    
    userRep.getUser(req.params.email, function(user){
        if(user.emailAddress) {
            res.render('pages/user', {user: user});      
        }
        res.render('pages/error'); 
    })
    
});

app.listen(8080);
console.log('8080 is the magic port');