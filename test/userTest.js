'use strict';

var chai = require('chai'),
	sinon = require('sinon'),
	expect = chai.expect,
    fakeRedis = require('fakeredis'),
    User = require('../User'),
    UserRepository = require('../userRepository');
    
    	
chai.should();


describe('Test the creation of a user', function() {
   it('Save a user and load it back', function(done) {
        var fakeRedisClient = fakeRedis.createClient("Fake Redis");
        
        var userRepository = UserRepository.create(fakeRedisClient);
        
        var expectedUser = User.create("Dev", "Experience", "devexperiencero@gmail.com", "Iasi", "Romania", "Software Developer", "DevExperience");
        
        userRepository.save(expectedUser, function(err, reply) {
            
            userRepository.getUser("devexperiencero@gmail.com", function(actualUser) {
                expect(expectedUser.emailAddress).to.equal(actualUser.emailAddress);
                expect(expectedUser.firstName).to.equal(actualUser.firstName);
                expect(expectedUser.lastName).to.equal(actualUser.lastName);
                expect(expectedUser.city).to.equal(actualUser.city);
                expect(expectedUser.country).to.equal(actualUser.country);
                expect(expectedUser.jobTitle).to.equal(actualUser.jobTitle);
                expect(expectedUser.jobCompany).to.equal(actualUser.jobCompany);
                
                done();
            });
        });
        
        
   });
   
   it('Dont return anything when the user doesnt exists', function(done) {
       var fakeRedisClient = fakeRedis.createClient("Fake Redis");
        
        var userRepository = UserRepository.create(fakeRedisClient);

        userRepository.getUser("test@test.com", function(actualUser) {
            expect(Object.keys(actualUser).length).to.equal(0);
            done();
        });
   });
});