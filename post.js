'use strict';
var moment = require('moment');

function Post() {}

Post.create = function (emailAddress, title, content, creationDate, votes){
    var post = new Post();

    post.emailAddress = emailAddress;
    post.title = title;
    post.content = content;
    post.votes = votes;
    post.creationDate = creationDate;

    post.getCreationDate = function () {
        var created = new Date(post.creationDate);
        return moment(created).format('dddd, MMMM DD, YYYY');
    };

    return post;
}

module.exports = Post;
