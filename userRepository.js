'use strict';

var User = require('./User');

function UserRepository() {}

UserRepository.create = function (redisClient) {
    var userRep = new UserRepository();
    
    userRep.redisClient = redisClient;
    userRep.separator = ":";
    
    return userRep;
}

var _userRep = UserRepository.prototype;



_userRep.save = function (user, callback) {
    var userHashKey = "Users" + this.separator + user.emailAddress;
    this.redisClient.hmset(userHashKey, ["FirstName", user.firstName, "LastName", user.lastName, "City", user.city, "Country", user.country, "JobTitle", user.jobTitle, "JobCompany", user.jobCompany], function (err, res) {
        //redis hmset callback
        callback();
    });
};

_userRep.getUser = function (userEmailAddress, callback) {
    var userHashKey = "Users" + this.separator + userEmailAddress;
    this.redisClient.hgetall(userHashKey, function (err, hashUser) {
        //(firstName, lastName, emailAddress, city, country, jobTitle, jobCompany)
        if(err){
            console.log("There was an error getting the user:");
            console.log(err);
            return null;
        }
        
        if(hashUser){
            var user = User.create(hashUser.FirstName, hashUser.LastName, userEmailAddress, hashUser.City, hashUser.Country, hashUser.JobTitle, hashUser.JobCompany);
            callback(user);
        }
        else{
            callback({});
        }
    });
}

module.exports = UserRepository;