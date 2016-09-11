/* jshint node: true */

'use strict';

function User() {}

User.create = function (firstName, lastName, emailAddress, city, country, jobTitle, jobCompany){
    var user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.emailAddress = emailAddress;
    user.city = city;
    user.country = country;
    user.jobTitle = jobTitle;
    user.jobCompany = jobCompany;

    return user;
};

module.exports = User;
