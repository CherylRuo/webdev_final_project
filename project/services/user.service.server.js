/**
 * Created by CherylRuo on 10/22/16.
 */
module.exports = function (app, model) {
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var facebookConfig = {
        clientID     : 1018543724921975,
        clientSecret : 'ee9c588d03a79ee3349731f926e63cd9',
        callbackURL  : 'http://localhost:3000/assignment/index.html',
        // clientID: process.env.FACEBOOK_CLIENT_ID,
        // clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        // callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        // profileFields: ['id', 'name', 'email']
    };
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post('/api/register', register);
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.get('/api/loggedin', loggedin);
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));
    app.get("/api/followedUsers/", findFollowedUsersByUserId);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', unregisterUser);

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var newUser = req.body;
        var username = newUser.username;
        model
            .findUserByUsername(username)
            .then(
                function (user){
                    if(user){
                        res.status(400).send("Username already exists.");
                    }
                    else {
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return model
                            .createUser(newUser);
                    }
                },
                function (err){
                    res.status(400).send(err);
                }
            ).then(
            function (user) {
                if (user) {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
    }

    function unregisterUser(req, res) { // delete
        model
            .deleteUser(req.params.userId)
            .then(function (status) {
                res.json(status);
            });
    }

    function updateUser(req, res) {
        model
            .updateUser(req.params.userId, req.body)
            .then(function (user) {
                res.json(user);
            });
    }

    function createUser(req, res) {
        model
            .createUser(req.body)
            .then(function (user) {
                res.json(user);
            });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if (username != null && password == null) {
            findUserByUsername(req, res);
        }
        if (username != null && password != null) {
            findUserByCredentials(req, res);
        }
    }

    function findUserByCredentials(req, res) {
        model
            .findUserByCredentials(req.query.username, req.query.password)
            .then(function (user) {
                res.json(user);
            });
    }

    function findUserByUsername(req, res) {
        model
            .findUserByUsername(req.query.username)
            .then(function (user) {
                res.json(user);
            });
    }

    function findUserById(req, res) {
        model
            .findUserById(req.params.userId)
            .then(function (user) {
                res.json(user);
            });
    }

    function findFollowedUsersByUserId(req, res) {
        model
            .findUserById(req.params.userId)
            .then(function (user) {
                var followedUserIds = user.user_followed;
                model
                    .findUserByIds(followedUserIds)
                    .then(function (followedUsers) {
                        res.json(followedUsers);
                    });
            });
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        model
            .findUserByFacebookId(profile.id)
            .then(
                function (facebookUser) {
                    if (facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            username: profile.name.givenName.concat(profile.name.familyName).toLowerCase(),
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            facebook: {
                                token: token,
                                id: profile.id
                            }
                        };
                        model
                            .createUser(facebookUser)
                            .then(
                                function (facebookUser) {
                                    return done(null, facebookUser);
                                }
                            );
                    }
                });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .findUserById(user._id)
            .then(
                function (user) {
                    delete user.password;
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model
            .findUserByUsername(username)
            .then(
                function (user) {
                    console.log(password);
                    console.log(bcrypt.hashSync(password));
                    console.log(user.password);

                    if(user && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }
};