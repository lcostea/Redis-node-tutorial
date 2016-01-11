'use strict';

function UserRegistration() {}

UserRegistration.create = function (redisClient) {
    var userRepository = new UserRegistration();
    
    userRepository.redisClient = redisClient;
    userRepository.separator = ":";
    
    return userRepository;
}

var _userRep = UserRegistration.prototype;



_userRep.save = function (user, callback) {
    var userHashKey = "Users" + this.separator + user.emailAddress;
    this.redisClient.hmset(userHashKey, ["FirstName", user.firstName, "LastName", user.lastName, "City", user.city, "Country", user.country, "JobTitle", user.jobTitle, "JobCompany", user.jobCompany], function (err, res) {
        //redis hmset callback
        callback();
    });
};

module.exports = UserRegistration;