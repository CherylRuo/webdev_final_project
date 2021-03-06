/**
 * Created by CherylRuo on 10/22/16.
 */
module.exports = function (app, model) {

    app.post('/api/user/:userId/theme', createThemeForUser);
    app.get('/api/user/:userId/theme', findAllThemesForUser);
    app.get('/api/followedThemes/:userId', findFollowedThemesForUser);
    app.get('/api/theme/:themeId', findThemeById);
    app.get('/api/searchThemes/:themeQuery', searchThemes);
    app.get('/api/searchUsers/:userQuery', searchUsers);
    app.get("/api/themeList", findAllThemes);
    app.put('/api/theme/:themeId', updateTheme);
    app.delete('/api/theme/:themeId', deleteTheme);
    app.post('/api/theme/addHashTag/:snatchId',getCreateIdByName);

    function createThemeForUser(req, res) {
        model
            .createThemeForUser(req.params.userId, req.body)
            .then(function(theme) {
                res.json(theme);
            });
    }

    function findAllThemesForUser(req, res) {
        model
            .findAllThemesForUser(req.params.userId)
            .then(function(themes) {
                res.json(themes);
            });
    }

    function findFollowedThemesForUser(req, res) {
        model
            .findFollowedThemesForUser(req.params.userId)
            .then(function(followedThemes) {
                res.json(followedThemes);
            });
    }

    function findThemeById(req, res) {
        model
            .findThemeById(req.params.themeId)
            .then(function(theme) {
                res.json(theme);
            });
    }

    function findAllThemes(req, res) {
        model
            .findAllThemes()
            .then(function (themes) {
                res.json(themes);
            });
    }

    function searchThemes(req, res) {
        model
            .searchThemes(req.params.themeQuery)
            .then(function(themeResult) {
                res.json(themeResult);
            });
    }

    function searchUsers(req, res) {
        model
            .searchUsers(req.params.userQuery)
            .then(function(userResult) {
                res.json(userResult);
            });
    }

    function updateTheme(req, res) {
        model
            .updateTheme(req.params.themeId, req.body)
            .then(function(theme) {
                res.json(theme);
            });
    }

    function deleteTheme(req, res) {
        model
            .deleteTheme(req.params.themeId)
            .then(function(status){
                res.json(status);
            });
    }

    function getCreateIdByName(req, res){
        model
            .getCreateIdByName(req.user._id, req.params.snatchId, req.body)
            .then(function(themeId) {
                res.json(themeId);
            });
    }
};
