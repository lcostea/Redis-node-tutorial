'use strict';

var chai = require('chai'),
	  sinon = require('sinon'),
	  expect = chai.expect,
    fakeRedis = require('fakeredis'),
    User = require('../User'),
    UserRepository = require('../userRepository');


chai.should();


describe('Test the creation of a user', function() {

   it('Dont return anything when the user doesnt exists', function(done) {
       var fakeRedisClient = fakeRedis.createClient("Fake Redis");

        var userRepository = UserRepository.create(fakeRedisClient);

        userRepository.getUser("test@test.com", function(actualUser) {
            expect(Object.keys(actualUser).length).to.equal(0);
            done();
        });
   });

	 it('Create 2 users and see everything goes OK', function(done) {
	 		var fakeRedisClient = fakeRedis.createClient("Fake Redis");

	 		 var userRepository = UserRepository.create(fakeRedisClient);

			 var firstUser = User.create("Voxxed", "Days", "first@gmail.com", "Iasi", "Romania", "Software Developer", "Voxxed");
			 var secondUser = User.create("Voxxed", "Days", "second@gmail.com", "Iasi", "Romania", "Software Developer", "Voxxed");

			 userRepository.save(firstUser, function(err, reply) {
				 userRepository.save(secondUser, function (err, reply){
					 userRepository.getLastRegisteredUsers(2, function(lastRegisteredUsers) {
						 expect(lastRegisteredUsers[0]).to.equal('second@gmail.com');
						 expect(lastRegisteredUsers[1]).to.equal('first@gmail.com');
						 userRepository.getUser(firstUser.emailAddress, function(actualUser) {
                 expect(firstUser.emailAddress).to.equal(actualUser.emailAddress);
                 expect(firstUser.firstName).to.equal(actualUser.firstName);
                 expect(firstUser.lastName).to.equal(actualUser.lastName);
                 expect(firstUser.city).to.equal(actualUser.city);
                 expect(firstUser.country).to.equal(actualUser.country);
                 expect(firstUser.jobTitle).to.equal(actualUser.jobTitle);
                 expect(firstUser.jobCompany).to.equal(actualUser.jobCompany);

                 done();
             });
           });
				 });
				});
			 });

});
