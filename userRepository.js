'use strict';

var User = require('./User');

function UserRepository() {}

UserRepository.create = function (redisClient) {
    var userRep = new UserRepository();

    userRep.redisClient = redisClient;
    userRep.separator = ":";
    userRep.lastRegisteredUsersKey = "LastRegisteredUsers";
    userRep.userHashKeyPrefix = "Users";

    return userRep;
}

var _userRep = UserRepository.prototype;



_userRep.save = function (user, callback) {
    var userHashKey = this.userHashKeyPrefix + this.separator + user.emailAddress;
    var batchCommands = this.redisClient.batch();
    batchCommands.hmset(userHashKey, ["FirstName", user.firstName, "LastName", user.lastName, "City", user.city, "Country", user.country, "JobTitle", user.jobTitle, "JobCompany", user.jobCompany], function (err, res) {
    });
    batchCommands.lpush(this.lastRegisteredUsersKey, user.emailAddress);
    batchCommands.exec(function (err, replies) {
        callback();
    });
};

_userRep.getUser = function (userEmailAddress, callback) {
    var userHashKey = this.userHashKeyPrefix + this.separator + userEmailAddress;
    this.redisClient.hgetall(userHashKey, function (err, hashUser) {
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
};

_userRep.getLastRegisteredUsers = function(howMany, callback) {
    this.redisClient.lrange(this.lastRegisteredUsersKey, 0, -1, function (err, usersList) {
        if(err){
            console.log("There was an error getting the users list :");
            console.log(err);
            return null;
        }

        callback(usersList);
    });
};

module.exports = UserRepository;
