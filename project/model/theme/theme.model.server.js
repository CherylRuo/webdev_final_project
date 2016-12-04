/**
 * Created by CherylRuo on 11/9/16.
 */
var q = require("q");

module.exports = function(db, mongoose) {
    var UserModel = mongoose.model('UserModel');
    var ThemeModel  = mongoose.model('ThemeModel');
    var api = {
        createThemeForUser: createThemeForUser,
        findAllThemesForUser: findAllThemesForUser,
        findThemeById: findThemeById,
        updateTheme: updateTheme,
        deleteTheme: deleteTheme
    };
    return api;

    function createThemeForUser(userId, theme) {
        var deferred = q.defer();
        console.log("Create a theme.");
        theme._user = userId;
        ThemeModel.create(theme, function(err, theme) {
            UserModel.findById(userId, function (err, user) {
                user.themes_followed.push(theme._id);
                user.save(function () {
                    deferred.resolve(theme);
                });
            });
        });

        return deferred.promise;
    }

    function findAllThemesForUser(userId) {
        var deferred = q.defer();

        ThemeModel.find({_user: userId}, function(err, theme){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function findThemeById(themeId) {
        var deferred = q.defer();

        ThemeModel.findById(themeId, function(err, theme){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function updateTheme(themeId, theme) {
        var deferred = q.defer();

        // theme.delete("_id");

        ThemeModel.update({_id: themeId}, {$set: theme}, function(err, theme) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function deleteTheme(themeId) {
        var deferred = q.defer();
        ThemeModel.findById(themeId, function(err, theme){
            if(err) {
                deferred.reject(err);
            } else {
                var userId = theme._user;
                ThemeModel.remove({_id: themeId}, function(err, status) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(status);
                        UserModel.findById(userId, function (err, user) {
                            var themes = user.themes;
                            for(var i=themes.length-1; i>0; i--) {
                                if(themes[i] == themeId)
                                    themes.splice(i, 1);
                            }
                            user.save(function () {});
                        });
                    }
                });
            }
        });

        return deferred.promise;
    }
};

