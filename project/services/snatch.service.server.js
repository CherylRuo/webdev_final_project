/**
 * Created by CherylRuo on 10/22/16.
 */
module.exports = function (app, model) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var express = require('express');

    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.post('/api/theme/:themeId/snatch', createSnatch);
    app.get('/api/theme/:themeId/snatch', findAllSnatchesForTheme);
    app.get('/api/snatch/:snatchId', findSnatchById);
    app.put('/api/snatch/:snatchId', updateSnatch);
    app.delete('/api/snatch/:snatchId', deleteSnatch);


    function uploadImage(req, res) {
        var myFile = req.file;
        var snatch = req.body;
        var userId = req.body.userId;
        var themeId = req.body.themeId;
        var snatchId = req.body.snatchId;

        if(myFile == null) {
            res.redirect('/project/index.html#/user/'+userId+'/theme/'+themeId+'/snatch/'+snatchId);
            return;
        }
        var width         = req.body.width;
        var filename      = myFile.filename;     // new file name in upload folder

        snatch.url = "/uploads/" + filename;
        snatch.width = width;

        model
            .updateSnatch(snatchId, snatch)
            .then(function(snatch) {
                res.json(snatch);
            });
        res.redirect('/project/index.html#/user/'+userId+'/theme/'+themeId+'/snatch/'+snatchId);
    }

    function createSnatch(req, res) {
        model
            .createSnatch(req.params.themeId, req.body)
            .then(function(snatch) {
                res.json(snatch);
            });
    }

    function findAllSnatchesForTheme(req, res) {
        model
            .findAllSnatchesForTheme(req.params.themeId)
            .then(function(theme) {
                res.json(theme);
            });
    }

    function findSnatchById(req, res) {
        model
            .findSnatchById(req.params.snatchId)
            .then(function(snatch) {
                res.json(snatch);
            });
    }

    function updateSnatch(req, res) {
        model
            .updateSnatch(req.params.snatchId, req.body)
            .then(function(snatch) {
                res.json(snatch);
            });
    }

    function deleteSnatch(req, res) {
        model
            .deleteSnatch(req.params.snatchId)
            .then(function(status){
                res.json(status);
            });
    }
};