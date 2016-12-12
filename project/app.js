/**
 * Created by CherylRuo on 11/27/16.
 */
module.exports = function(app) {
    var connectionString = 'mongodb://127.0.0.1:27017/snatchSchema';

    var mongoose = require("mongoose");
    var autoIncrement = require('mongoose-auto-increment');
    var connection = mongoose.createConnection(connectionString);
    autoIncrement.initialize(connection);

    var db = connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("we're connected!");
    });

    require("./model/models.server.js")(mongoose, autoIncrement);
    var userModel = require("./model/user/user.model.server.js")(mongoose, db);
    require("./services/user.service.server.js")(app, userModel);

    var themeModel = require("./model/theme/theme.model.server.js")(mongoose, db);
    require("./services/theme.service.server.js")(app, themeModel);

    var snatchModel = require("./model/snatch/snatch.model.server.js")(mongoose, db);
    require("./services/snatch.service.server.js")(app, snatchModel);
    require("./services/walmart.service.server.js")(app);
};