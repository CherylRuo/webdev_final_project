/**
 * Created by CherylRuo on 11/9/16.
 */
module.exports = function(mongoose, autoIncrement) {
    var searchPlugin = require('mongoose-search-plugin');
    var SnatchSchema = require("./snatch/snatch.schema.server.js")(mongoose);
    SnatchSchema.plugin(autoIncrement.plugin, 'SnatchModel');
    mongoose.model("SnatchModel", SnatchSchema);
    var ThemeSchema = require("./theme/theme.schema.server.js")(mongoose, searchPlugin);
    ThemeSchema.plugin(autoIncrement.plugin, 'ThemeModel');
    mongoose.model("ThemeModel", ThemeSchema);
    var UserSchema = require("./user/user.schema.server.js")(mongoose, searchPlugin);
    UserSchema.plugin(autoIncrement.plugin, 'UserModel');
    mongoose.model("UserModel", UserSchema);
};