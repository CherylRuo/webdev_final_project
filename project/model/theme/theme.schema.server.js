/**
 * Created by CherylRuo on 11/9/16.
 */
module.exports = function(mongoose) {
    var Theme = mongoose.Schema({
        _user: {type: Number, ref: 'UserModel'},
        _theme: {type: Number, ref: 'ThemeModel'},
        name: String,
        description: String,
        snatches: [{type: Number, ref: 'SnatchModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "theme"});
    return Theme;
};