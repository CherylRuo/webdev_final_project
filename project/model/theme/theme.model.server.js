/**
 * Created by CherylRuo on 11/9/16.
 */
var q = require("q");

module.exports = function (db, mongoose) {
    var UserModel = mongoose.model('UserModel');
    var ThemeModel = mongoose.model('ThemeModel');
    var api = {
        createThemeForUser: createThemeForUser,
        findAllThemesForUser: findAllThemesForUser,
        findFollowedThemesForUser: findFollowedThemesForUser,
        findThemeById: findThemeById,
        findThemeByIds: findThemeByIds,
        findAllThemes: findAllThemes,
        searchThemes: searchThemes,
        searchUsers: searchUsers,
        updateTheme: updateTheme,
        deleteTheme: deleteTheme,
        getCreateIdByName: getCreateIdByName
    };
    return api;

    function createThemeForUser(userId, theme) {
        var deferred = q.defer();
        theme._user = userId;
        ThemeModel.create(theme, function (err, theme) {
            UserModel.findById(userId, function (err, user) {
                user.themes.push(theme._id);
                user.save(function () {
                    deferred.resolve(theme);
                });
            });
        });

        return deferred.promise;
    }

    function findAllThemesForUser(userId) {
        var deferred = q.defer();

        ThemeModel.find({_user: userId}, function (err, theme) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function findThemeById(themeId) {
        var deferred = q.defer();

        ThemeModel.findById(themeId, function (err, theme) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function findThemeByIds(ids) {
        var deferred = q.defer();
        ThemeModel.find({
            '_id': {$in: ids}
        }, function (err, themes) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(themes);
            }
        });
        return deferred.promise;
    }

    function findFollowedThemesForUser(userId) {
        var deferred = q.defer();

        UserModel.findById(userId, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                var themeIds = user.themes_followed;
                deferred.resolve(findThemeByIds(themeIds));
            }
        });
        return deferred.promise;
    }

    function findAllThemes() {
        var deferred = q.defer();

        ThemeModel.find({}, function (err, themes) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(themes);
            }
        });

        return deferred.promise;
    }

    function searchThemes(themeQuery) {
        var deferred = q.defer();
        console.log(themeQuery);
        ThemeModel.search(themeQuery, {name: 1}, {
            conditions: {name: {$exists: true}},
            sort: {name: 1},
            limit: 10
        }, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data.results);
            }
            // array of finded results
            console.log(data.results);
            // count of all matching objects
            console.log(data.totalCount);
        });

        return deferred.promise;
    }

    function searchUsers(userQuery) {
        var deferred = q.defer();

        UserModel.search(userQuery, {username: 1}, {
            conditions: {username: {$exists: true}},
            sort: {username: 1},
            limit: 10
        }, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data.results);
            }
            // array of finded results
            console.log(data.results);
            // count of all matching objects
            console.log(data.totalCount);
        });
        return deferred.promise;
    }

    function updateTheme(themeId, theme) {
        var deferred = q.defer();

        // theme.delete("_id");

        ThemeModel.update({_id: themeId}, {$set: theme}, function (err, theme) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(theme);
            }
        });

        return deferred.promise;
    }

    function deleteTheme(themeId) {
        var deferred = q.defer();
        ThemeModel.findById(themeId, function (err, theme) {
            if (err) {
                deferred.reject(err);
            } else {
                var userId = theme._user;
                console.log(userId);
                ThemeModel.remove({_id: themeId}, function (err, status) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(status);
                        UserModel.findById(userId, function (err, user) {
                            var themes = user.themes;
                            for (var i = themes.length - 1; i > 0; i--) {
                                if (themes[i] == themeId)
                                    themes.splice(i, 1);
                            }
                            user.save(function () {
                            });
                        });
                    }
                });
            }
        });

        return deferred.promise;
    }

    function getCreateIdByName(userId, snatchId, themeTag) {
        var deferred = q.defer();
        var name = themeTag.name;
        ThemeModel.findOne({'name': name}, function (err, theme) {
            if (err) {
                deferred.reject(err);
            } else {
                if (theme) {
                    theme.snatches.push(snatchId);
                    theme.save(function () {
                    });
                    console.log(theme._id);
                    deferred.resolve(theme._id);
                } else {
                    theme = {};
                    theme.name = name;
                    theme._user = userId;
                    theme.snatches = [snatchId];
                    ThemeModel.create(theme, function (err, themeresult) {
                        deferred.resolve(themeresult._id);
                        UserModel.findById(userId, function (err, user) {
                            user.themes.push(themeresult._id);
                            user.save(function () {
                            });
                        });
                    });
                }
            }
        });

        return deferred.promise;
    }
};

