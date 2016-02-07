'use strict';

var chai = require('chai'),
	  sinon = require('sinon'),
	  expect = chai.expect,
    fakeRedis = require('fakeredis'),
    Post = require('../Post'),
    PostRepository = require('../postRepository');


chai.should();


describe('Test the creation of a user post', function() {
   it('Save a post and load it back', function(done) {
     var fakeRedisClient = fakeRedis.createClient("Fake Redis");

     var postRepository = PostRepository.create(fakeRedisClient);
     var creationDate = Date.now();

     var firstPost = Post.create("first@gmail.com", "Voxxed Days Bucharest 2016", "Voxxed Days Bucharest 2016 - seems really interesting", creationDate, 0);

     postRepository.save(firstPost, function(err, reply) {
			 	var allOperationsToDo = 2;
        var postHashKey = postRepository.getPostsHashKey(firstPost.emailAddress, firstPost.title);
        postRepository.getPost(postHashKey, function(actualPost) {
	       expect(firstPost.emailAddress).to.equal(actualPost.emailAddress);
	       expect(firstPost.title).to.equal(actualPost.title);
	       expect(firstPost.content).to.equal(actualPost.content);
	       expect(firstPost.creationDate).to.equal(actualPost.creationDate);
	       expect(firstPost.votes).to.equal(actualPost.votes);
				 allOperationsToDo --;

				 if(allOperationsToDo === 0) {
	       		done();
				 }

        });
				postRepository.getLastCreatedPosts(1, function(lastCreatedPostsList) {
					expect(lastCreatedPostsList[0].title).to.equal('Voxxed Days Bucharest 2016');
					expect(lastCreatedPostsList[0].key).to.equal(postHashKey);
					allOperationsToDo --;

					if(allOperationsToDo === 0) {
						 done();
					}
				});
	    });
    });
});
