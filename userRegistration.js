'use strict';

function UserRegistration() {}

UserRegistration.create = function (repository) {
    var userReg = new UserRegistration();
    
    userReg.userRepository = repository;
    
    return userReg;
}

var _userRep = UserRegistration.prototype;



_userRep.createNewUser = function (user, callback) {
    this.userRepository.save(user, callback);
};

module.exports = UserRegistration;