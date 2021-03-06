/**
 * Created by CherylRuo on 11/9/16.
 */
module.exports = function(mongoose) {
    var Snatch = mongoose.Schema({
        _user: {type: Number, ref: 'UserModel'},
        _theme: [{type: Number, ref: 'ThemeModel'}],
        description: String,
        dateCreated: {type: Date, default: Date.now},
        url: String,
        comment: {type: String}
    }, {collection: "snatch"});
    return Snatch;
};