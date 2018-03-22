const userModel = require('../../UserModel.js');
var passport = require('passport'),
    strategy = require('passport-local').Strategy;

/* Highly incomplete code for auth & auth using passport, passport-local,
    passport-local-mongoose, and express-session. Probably best to start fresh.
*/

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

/* This might need adapting to app context */
passport.deserializeUser(function(username, done) {
    userModel.find(username, function(err, user) {
        done(err, user);
    });
});

/* Query DB for Users with the given username and authenticate */
passport.use(new strategy (
    function(username, password, done) {
        userModel.find({username: username}, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if(user.password != password) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

module.exports = {
    init: function (router) {
        router.use(passport.initialize());
        router.use(passport.session());
    },
    login : function(req, res, next) {
        return passport.authenticate('local', function(err, user, info) {
            if (user) {
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                });
            } else {
                next();
            }
        })(req, res, next);
    },
    logout : function(req, res, next) {
        req.logout();
        next();
    },
    check : function(params) {
        return function(req, res, next) {
            if (req.user || req.isAuthenticated()) {
                if (typeof params.onSuccess == 'function') {
                    params.onSuccess(req, res, next)
                } else {
                    next();
                }
            } else {
                if (typeof params.onFailure == 'function') {
                    params.onFailure(req, res, next)
                } else {
                    res.redirect('/login');
                    res.end();
                }
            }
        }
    },
    register : passport.authenticate,
    passport : passport
};