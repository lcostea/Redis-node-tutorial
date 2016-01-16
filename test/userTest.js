'use strict';

var chai = require('chai'),
	sinon = require('sinon'),
	expect = chai.expect,
    redis = require('redis'),
    User = require('../User'),
    UserRepository = require('../userRepository');
    
    	
chai.should();


describe('Test the creation of a user', function() {
    it('In case everything goes ok hmset from redis should be called', function(done) {
        var redisClient = redis.createClient();
        
        var infoStub = sinon.stub(redisClient, "info");
        infoStub.callsArg(0);
        
        // var hmsetStub = sinon.stub(redisClient, "hmset");
        // hmsetStub.callsArg(2);
        
        var userRepository = UserRepository.create(redisClient);
        
        var user = User.create("John", "Smith", "johnny@smith.com", "Bucharest", "Romania", "Software Tester", "Best Company");     

        userRepository.save(user, function() {
            expect(infoStub.called).to.be.true;
            done();
        });
        
        
   });  
   it('Return a valid user when everything goes ok', function(done) {
        var redisClient = redis.createClient();
        
        
        var userRepository = UserRepository.create(redisClient);
        
        var expectedUser = User.create("Dev", "Experience", "devexperiencero@gmail.com", "Iasi", "Romania", "Software Developer", "DevExperience");
        
        var hgetallResponse = {
            FirstName: 'Dev',
            LastName: 'Experience',
            City: 'Iasi',
            Country: 'Romania',
            JobTitle: 'Software Developer',
            JobCompany: 'DevExperience'
        };
        
        
        var infoStub = sinon.stub(redisClient, "info");
        infoStub.callsArg(0);

        
        var hgetallUserStub = sinon.stub(redisClient, "hgetall");
        hgetallUserStub.yields(null, hgetallResponse);
        

        userRepository.getUser("devexperiencero@gmail.com", function(actualUser) {
            hgetallUserStub.restore();
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
   
   it('Dont return anything when the user doesnt exists', function(done) {
       var redisClient = redis.createClient();
        
        var userRepository = UserRepository.create(redisClient);        
        
        var infoStub = sinon.stub(redisClient, "info");
        infoStub.callsArg(0);

        
        var hgetallUserStub = sinon.stub(redisClient, "hgetall");
        hgetallUserStub.yields(null, null);
        

        userRepository.getUser("test@test.com", function(actualUser) {
            expect(Object.keys(actualUser).length).to.equal(0);
            done();
        });
   });
});