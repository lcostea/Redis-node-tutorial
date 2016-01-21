'use strict';

var Post = require('./post'),
    PostRepository = require('./postRepository');

function PostController() {}

PostController.create = function (redisClient) {
    var postCtrl = new PostController();
    
    postCtrl.redisClient = redisClient;
    
    return postCtrl;
};

var _userCtrl = PostController.prototype;


module.exports = PostController;