'use strict';

var Post = require('./post');

function PostRepository() {}

PostRepository.create = function (redisClient) {
    var postRep = new PostRepository();
    
    postRep.redisClient = redisClient;
    postRep.separator = ":";
    
    return postRep;
}

var _userRep = PostRepository.prototype;

module.exports = PostRepository;