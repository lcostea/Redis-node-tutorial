'use strict';

var Post = require('./post');

exports.ToLastCreatedPost = function(title, key) {
  var lastCreatedPost = {
    title: title,
    key: key
  };
  
  return lastCreatedPost;
}
