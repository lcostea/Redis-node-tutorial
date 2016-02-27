'use strict';

var Post = require('./post'),
    async = require('async'),
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


_postCtrl.getPost = function(req, res) {

    var postRep = PostRepository.create(this.redisClient);

    async.parallel({
        post: function(callback) {

            postRep.getPost(req.params.key, function(post){
                callback(null, post);
            });
        },
       topVotedPosts: function(callback) {
           postRep.getTopVotedPosts(5, function(topVotedPosts){
               callback(null, topVotedPosts);
           });
       },
       lastCreatedPosts: function(callback) {
         postRep.getLastCreatedPosts(5, function(lastCreatedPosts){
             callback(null, lastCreatedPosts);
         });
       }
    },
    function(err, results) {
        res.render('pages/posts', results);
    });

};

_postCtrl.getPosts = function(req, res) {

    var postRep = PostRepository.create(this.redisClient);

    async.parallel({
       topVotedPosts: function(callback) {
           postRep.getTopVotedPosts(5, function(topVotedPosts){
               callback(null, topVotedPosts);
           });
       },
       lastCreatedPosts: function(callback) {
         postRep.getLastCreatedPosts(5, function(lastCreatedPosts){
             callback(null, lastCreatedPosts);
         });
       }
    },
    function(err, results) {
        res.render('pages/posts', results);
    });

};


_postCtrl.votePost = function(req, res) {
    var postRep = PostRepository.create(this.redisClient);

    postRep.vote(1, req.body.email, req.body.title, function(postKey) {
        res.redirect('/posts/' + postKey);
    });

};

module.exports = PostController;
