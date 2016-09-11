/* jshint node: true */

'use strict';

var User = require('./user'),
    async = require('async'),
    PostRepository = require('./postRepository'),
    UserRepository = require('./userRepository');

function UserController() {}

UserController.create = function (redisClient) {
    var userCtrl = new UserController();

    userCtrl.redisClient = redisClient;

    return userCtrl;
};

var _userCtrl = UserController.prototype;

_userCtrl.getUsers = function(req, res) {
    var userRep = UserRepository.create(this.redisClient);

    var postRep = PostRepository.create(this.redisClient);

      async.parallel({
         user: function(callback) {
             if (req.params.email) {
               userRep.getUser(req.params.email, function(user){
                   callback(null, user);
               });
             }
             else {
               callback(null, {});
             }

         },
         lastRegisteredUsers: function(callback) {
             userRep.getLastRegisteredUsers(20, function(lastRegisteredUsers){
                 callback(null, lastRegisteredUsers);
             });
         },
         lastPostsPerUser: function(callback) {
             if(req.params.email) {
               postRep.getLastPostsPerUser(20, req.params.email, function(lastPostsPerUser){
                   callback(null, lastPostsPerUser);
               });
             }
             else {
               callback(null, {});
             }

         }
      },
      function(err, results) {
          res.render('pages/users', results);
      });
};

_userCtrl.createUser = function(req, res) {
    var userRep = UserRepository.create(this.redisClient);
    var user = User.create(req.body.txtFirstName, req.body.txtLastName, req.body.txtEmail, req.body.txtCity, req.body.txtCountry, req.body.txtJobTitle, req.body.txtJobCompany);
    userRep.save(user, function() {
        res.redirect('/users');
    });

};

module.exports = UserController;
