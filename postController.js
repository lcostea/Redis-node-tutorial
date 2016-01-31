'use strict';

var Post = require('./post'),
    PostRepository = require('./postRepository');

function PostController() {}

PostController.create = function (redisClient) {
    var postCtrl = new PostController();

    postCtrl.redisClient = redisClient;

    return postCtrl;
};

var _postCtrl = PostController.prototype;

_postCtrl.createPost = function(req, res) {
    var postRep = PostRepository.create(this.redisClient);
    var post = Post.create(req.body.txtEmail, req.body.txtTitle, req.body.txtContent, Date.now(), 0);
    postRep.save(post, function() {
        res.redirect('/users/' + post.emailAddress);
    });

};


_postCtrl.getPosts = function(req, res) {

    var postRep = PostRepository.create(this.redisClient);

    async.parallel({
       topVotedPosts: function(callback) {
           postRep.getTopVotedPosts(20, function(lastRegisteredUsers){
               callback(null, lastRegisteredUsers);
           });
       },
       lastCreatedPosts: function(callback) {
           postRep.getLastPostsPerUser(20, req.params.email, function(lastPostsPerUser){
               callback(null, lastPostsPerUser);
           });
       }
    },
    function(err, results) {
        res.render('pages/users', results);
    });

};

module.exports = PostController;
