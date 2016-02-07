'use strict';

var Post = require('./post'),
    postTransformer = require('./postTransformer');

function PostRepository() {}

PostRepository.create = function (redisClient) {
    var postRep = new PostRepository();

    postRep.redisClient = redisClient;
    postRep.postHashKeyPrefix = "Posts";
    postRep.separator = ":";
    postRep.topPostsKey = "Posts:Top";
    postRep.allPostsKey = "Posts:All";
    postRep.lastCreatedPostsKey = "Posts:LastCreated";

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
    var lastCreatedPost = postTransformer.ToLastCreatedPost(post.title, postHashKey);
    var lastCreatedPostString = JSON.stringify(lastCreatedPost);

    var multiCommands = this.redisClient.multi();
    multiCommands.hmset(postHashKey, ["Title", post.title, "Content", post.content, "EmailAddress", post.emailAddress, "CreationDate", post.creationDate], function (err, res) {
    });
    multiCommands.lpush(postsPerUserKey, post.title);
    multiCommands.lpush(this.lastCreatedPostsKey, lastCreatedPostString);
    multiCommands.zadd(this.topPostsKey, 0, postHashKey);
    multiCommands.zadd(this.allPostsKey, post.creationDate, lastCreatedPostString);
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

_postRep.getTopVotedPosts = function(howMany, callback) {
  this.redisClient.zrange(this.topPostsKey, -howMany, -1, function (err, topVotedPostsStringList) {
      if(err){
          console.log("There was an error getting the top voted posts list :");
          console.log(err);
          return null;
      }
      var topVotedPostsList = [];
      for (var topVotedIndex = 0;topVotedIndex < topVotedPostsStringList.length;topVotedIndex++) {
        var topVotedJsonString = topVotedPostsStringList[topVotedIndex];
        var topVotedPostKeyTitleUi = JSON.parse(topVotedJsonString);
        topVotedPostsList.push(topVotedPostKeyTitleUi);
      }
      callback(topVotedPostsList);
  });
};

_postRep.getLastCreatedPosts = function(howMany, callback) {
  this.redisClient.lrange(this.lastCreatedPostsKey, -howMany, -1, function (err, lastCreatedPostsStringList) {
      if(err){
          console.log("There was an error getting the last created posts list :");
          console.log(err);
          return null;
      }

      var lastCreatedPostsList = [];
      for (var lastCreatedIndex = 0;lastCreatedIndex < lastCreatedPostsStringList.length;lastCreatedIndex++) {
        var lastCreatedJsonString = lastCreatedPostsStringList[lastCreatedIndex];
        var lastCreatedPostKeyTitleUi = JSON.parse(lastCreatedJsonString);
        lastCreatedPostsList.push(lastCreatedPostKeyTitleUi);
      }


      callback(lastCreatedPostsList);
  });
};



_postRep.getPost = function(postHashKey, callback) {
  this.redisClient.hgetall(postHashKey, function (err, hashPost) {
      if(err){
          console.log("There was an error getting the user:");
          console.log(err);
          return null;
      }

      if(hashPost) {
          var post = Post.create(hashPost.EmailAddress, hashPost.Title, hashPost.Content, parseInt(hashPost.CreationDate), 0);
          callback(post);
      }
      else{
          callback({});
      }
  });
}



_postRep.vote = function(scoreToAdd, post, callback) {
    var postHashKey = this.getPostsHashKey(post.emailAddress, post.title);

    this.redisClient.zincrby(this.topPostsKey, scoreToAdd, postHashKey, function (err, newPostScore) {
        if(err){
            console.log("There was an voting for a post:");
            console.log(err);
            return null;
        }

        return newPostScore;
    });
};

module.exports = PostRepository;
