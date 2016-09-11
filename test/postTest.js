/* jshint node: true, mocha: true */

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
			 	var allOperationsToDo = 4;
        var postHashKey = postRepository.getPostsHashKey(firstPost.emailAddress, firstPost.title);
        postRepository.getPost(postHashKey, function(actualPost) {
					expect(firstPost.emailAddress).to.equal(actualPost.emailAddress);
					expect(firstPost.title).to.equal(actualPost.title);
					expect(firstPost.content).to.equal(actualPost.content);
					expect(firstPost.creationDate).to.equal(actualPost.creationDate);
					expect(firstPost.votes).to.equal(actualPost.votes);
					allOperationsToDo--;
					areOperationsDone(allOperationsToDo, done);

        });

				postRepository.getLastCreatedPosts(1, function(lastCreatedPostsList) {
					expect(lastCreatedPostsList[0].title).to.equal('Voxxed Days Bucharest 2016');
					expect(lastCreatedPostsList[0].key).to.equal(postHashKey);
					allOperationsToDo--;
					areOperationsDone(allOperationsToDo, done);
				});

				postRepository.getLastPostsPerUser(1, firstPost.emailAddress, function(postPerUserList) {
					expect(postPerUserList[0].title).to.equal('Voxxed Days Bucharest 2016');
					expect(postPerUserList[0].key).to.equal(postRepository.getPostsHashKey(firstPost.emailAddress, 'Voxxed Days Bucharest 2016'));
					allOperationsToDo--;
					areOperationsDone(allOperationsToDo, done);
				});

				postRepository.getTopVotedPosts(1, function(topVotedPostsList) {
					expect(topVotedPostsList[0].title).to.equal('Voxxed Days Bucharest 2016');
					expect(topVotedPostsList[0].votes).to.equal(0);
					expect(topVotedPostsList[0].key).to.equal(postRepository.getPostsHashKey(firstPost.emailAddress, 'Voxxed Days Bucharest 2016'));
					allOperationsToDo--;
					areOperationsDone(allOperationsToDo, done);
				});

				postRepository.getPosts(1, function(postsList) {
					expect(postsList[0].title).to.equal('Voxxed Days Bucharest 2016');
					expect(postsList[0].key).to.equal(postRepository.getPostsHashKey(firstPost.emailAddress, 'Voxxed Days Bucharest 2016'));
					allOperationsToDo--;
					areOperationsDone(allOperationsToDo, done);
				});

	    });
    });
});

function areOperationsDone(allOperationsToDo, callback) {
	if(allOperationsToDo === 0) {
		 callback();
	}
}
