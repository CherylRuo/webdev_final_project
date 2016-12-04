/**
 * Created by CherylRuo on 11/9/16.
 */
var q = require("q");

module.exports = function(db, mongoose) {
    var UserModel  = mongoose.model('UserModel');
    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByFacebookId: findUserByFacebookId,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser
    };
    return api;

    function createUser(user) {
        var deferred = q.defer();

        UserModel.create(user, function(err, user) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function findUserById(id) {
        var deferred = q.defer();

        UserModel.findById(id, function(err, user){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        console.log("find user By Credentials.");

        UserModel.findOne({username: username, password: password}, function(err, user){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();

        UserModel.findOne({username: username}, function(err, username){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(username);
            }
        });

        return deferred.promise;
    }

    function updateUser(id, user) {
        var deferred = q.defer();

        UserModel.update({_id: id}, {$set: user}, function(err, user) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });

        return deferred.promise;
    }

    function deleteUser(id) {
        var deferred = q.defer();

        UserModel.remove({_id: id}, function(err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });

        return deferred.promise;
    }
};

