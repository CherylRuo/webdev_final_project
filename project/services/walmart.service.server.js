module.exports = function (app, model) {
    app.get('/api/walmartSearch/:query', walmartSearch);
    function walmartSearch(req, res) {
        var searchTerm = req.params.query;
        var key = "5eztdeaxny33uau6dkxvhweu";
        var urlBase = "http://api.walmartlabs.com/v1/search?apiKey=API_KEY&query=TEXT";
        var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
        var request = require('request');
        request.get(url, function (err, res1, body) {
            res.json(body);
        });
    }
}