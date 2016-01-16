//how many up votes
//how many down votes
//title
//description

'use strict';

function Post() {}

Post.create = function (emailAddress, title, content, votes){
    var post = new Post();
    
    post.emailAddress = emailAddress;
    post.title = title;
    post.content = content;
    post.votes = votes;
    
    return post;
}

module.exports = Post;