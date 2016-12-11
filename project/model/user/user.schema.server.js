/**
 * Created by CherylRuo on 11/9/16.
 */
module.exports = function(mongoose, searchPlugin) {
    var User = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        DOB: {type: Date},
        userType: {type: String, enum: ['USER', 'ADMIN']},
        privacy: Boolean,
        user_followed: [{type: Number, ref: 'UserModel'}],
        themes_followed: [{type: Number, ref: 'ThemeModel'}],
        themes: [{type: Number, ref: 'ThemeModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "user"});
    User.plugin(searchPlugin, {
        fields: ['username']
    });
    return User;
};