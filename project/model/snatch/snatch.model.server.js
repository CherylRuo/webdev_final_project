/**
 * Created by CherylRuo on 11/9/16.
 */
var q = require("q");

module.exports = function(db, mongoose) {
    var SnatchModel  = mongoose.model('SnatchModel');
    var ThemeModel = mongoose.model('ThemeModel');

    var api = {
        createSnatch: createSnatch,
        findAllSnatchesForTheme: findAllSnatchesForTheme,
        findSnatchById: findSnatchById,
        updateSnatch: updateSnatch,
        deleteSnatch: deleteSnatch
    };
    return api;

    function createSnatch(themeId, snatch) {
        var deferred = q.defer();
        console.log("Create a snatch.");
        snatch._theme = themeId;

        SnatchModel.create(snatch, function(err, snatch) {
            ThemeModel.findById(themeId, function (err, theme) {
                theme.snatches.push(snatch._id);
                theme.save(function () {
                    deferred.resolve(snatch);
                });
            });
        });

        return deferred.promise;
    }

    function findAllSnatchesForTheme(themeId) {
        var deferred = q.defer();

        SnatchModel.find({_theme: themeId}, function(err, snatch){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(snatch);
            }
        });

        return deferred.promise;
    }

    function findSnatchById(snatchId) {
        var deferred = q.defer();

        SnatchModel.findById(snatchId, function(err, snatch){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(snatch);
            }
        });

        return deferred.promise;
    }

    function updateSnatch(snatchId, snatch) {
        var deferred = q.defer();

        SnatchModel.update({_id: snatchId}, {$set: snatch}, function(err, snatch) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(snatch);
            }
        });

        return deferred.promise;
    }

    function deleteSnatch(snatchId) {
        var deferred = q.defer();
        SnatchModel.findById(snatchId, function(err, snatch){
            if(err) {
                deferred.reject(err);
            } else {
                var themeId = snatch._theme;
                SnatchModel.remove({_id: snatchId}, function(err, status) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(status);
                        ThemeModel.findById(themeId, function (err, theme) {
                            var snatches = theme.snatches;
                            for(var i=snatches.length-1; i>0; i--) {
                                if(snatches[i] == snatchId)
                                    snatches.splice(i, 1);
                            }
                            theme.save(function () {});
                        });
                    }
                });
            }
        });

        return deferred.promise;
    }
};

