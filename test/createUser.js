'use strict';

var chai = require('chai'),
	sinon = require('sinon'),
	expect = chai.expect,
    redis = require('redis'),
    User = require('../User'),
    UserRegistration = require('../userRegistration');
    
    	
chai.should();


describe('Test the creation of a user', function() {
    it('In case everything goes ok hmset from redis should be called', function(done) {
        var redisClient = redis.createClient();
                
        var userRegistration = UserRegistration.create(redisClient);
        
        var user = User.create("Dev", "Experience", "devexperiencero@gmail.com", "Iasi", "Romania", "Software Developer", "DevExperience");     

        userRegistration.save(user, function() {
            done();
        });
   });  
});