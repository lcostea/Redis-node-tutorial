'use strict';

var Post = require('./post');

function PostRepository() {}

PostRepository.create = function (redisClient) {
    var postRep = new PostRepository();
    
    postRep.redisClient = redisClient;
    postRep.postHashKeyPrefix = "Posts";
    postRep.separator = ":";
    postRep.topPostskey = "Posts:Top";
    
    postRep.getPostsPerUserKey = function (emailAddress) {
        return postRep.postHashKeyPrefix + postRep.separator + emailAddress;
    };
    
    postRep.getPostsHashKey = function (emailAddress, title) {
        return postRep.postHashKeyPrefix + postRep.separator + emailAddress + postRep.separator + title;
    };
    
    return postRep;
}

var _postRep = PostRepository.prototype;

_postRep.save = function (post, callback) {
    var postHashKey = this.getPostsHashKey(post.emailAddress, post.title);
    var postsPerUserKey = this.getPostsPerUserKey(post.emailAddress);
    
    var multiCommands = this.redisClient.multi();
    multiCommands.hmset(postHashKey, ["Title", post.title, "Content", post.content, "EmailAddress", post.emailAddress, "CreationDate", post.creationDate], function (err, res) {
    });
    multiCommands.lpush(postsPerUserKey, post.title);
    multiCommands.zadd(this.topPostskey, 0, postHashKey);
    multiCommands.exec(function (err, replies) {
        callback();
    });
};

_postRep.getLastPostsPerUser = function(howMany, emailAddress, callback) {
    var postsPerUserKey = this.getPostsPerUserKey(emailAddress);
    var getPostsHashKey = this.getPostsHashKey;
    
    this.redisClient.lrange(postsPerUserKey, 0, -1, function (err, postsList) {
        if(err){
            console.log("There was an error getting the user posts list :");
            console.log(err);
            return null;
        }
        
        var postsLength = postsList.length;
        var postsKeyTitleArray = [];
        for(var postsIndex = 0; postsIndex < postsLength; ++ postsIndex) {
            
            var postKey = getPostsHashKey(emailAddress, postsList[postsIndex]);
            var postKeyTitle = {
                key: postKey,
                title: postsList[postsIndex]
                };
           postsKeyTitleArray.push(postKeyTitle);
        }
        
        callback(postsKeyTitleArray);    
    });
};

module.exports = PostRepository;