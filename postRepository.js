'use strict';

var Post = require('./post');

function PostRepository() {}

PostRepository.create = function (redisClient) {
    var postRep = new PostRepository();
    
    postRep.redisClient = redisClient;
    postRep.postHashKeyPrefix = "Posts";
    postRep.separator = ":";
    postRep.postsListPerUserKey = "";
    
    return postRep;
}

var _postRep = PostRepository.prototype;

_postRep.save = function (post, callback) {
    var postHashKey = this.postHashKeyPrefix + this.separator + post.emailAddress + this.separator + post.title;
    var multiCommands = this.redisClient.multi();
    multiCommands.hmset(postHashKey, ["Title", post.title, "Content", post.content, "EmailAddress", post.emailAddress, "CreationDate", post.creationDate], function (err, res) {
    });
    multiCommands.lpush(this.postsListPerUserKey, postHashKey);
    //ZADD Posts:Top postHashKey
    multiCommands.exec(function (err, replies) {
        callback();
    });
};

module.exports = PostRepository;