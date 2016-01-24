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
    
}

module.exports = PostController;