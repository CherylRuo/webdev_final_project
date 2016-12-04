/**
 * Created by CherylRuo on 11/9/16.
 */
module.exports = function(mongoose, autoIncrement) {
    var SnatchSchema = require("./snatch/snatch.schema.server.js")(mongoose);
    SnatchSchema.plugin(autoIncrement.plugin, 'SnatchModel');
    mongoose.model("SnatchModel", SnatchSchema);
    var ThemeSchema = require("./theme/theme.schema.server.js")(mongoose);
    ThemeSchema.plugin(autoIncrement.plugin, 'ThemeModel');
    mongoose.model("ThemeModel", ThemeSchema);
    var UserSchema = require("./user/user.schema.server.js")(mongoose);
    UserSchema.plugin(autoIncrement.plugin, 'UserModel');
    mongoose.model("UserModel", UserSchema);
};