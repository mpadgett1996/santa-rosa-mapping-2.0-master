var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./public/javascripts/auth');
var session = require('express-session');
var passport = require('passport'); // remove if necessary
var LocalStrategy = require('passport-local').Strategy; // remove if necessary
var userModel = require('./UserModel.js');

const mongoose = require('mongoose'); // Database API
//mongoose.connect('mongodb://localhost/sr-mapping');
mongoose.connect('mongodb://dewey.cs.sonoma.edu/test'); // Define path to MongoDB database here

var prefix_routes = require('./routes/prefixes_routes');
var view_routes = require('./routes/view_routes');
var upload_routes = require('./routes/upload_routes');
var report_routes = require('./routes/report_routes');
var catalog_routes = require('./routes/catalog_routes');
var login_routes = require('./routes/login_routes');
var admin_routes = require('./routes/admin_routes');

var app = express();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* New Auth Code 
app.use(session({
    secret: 'secret_cat',
    saveUninitialized: true,
    resave: false
}));
auth.init(app);

app.use(function(req, res, next) {
  res.context = req.user;
  req.page.props = {};
  if (req.user && typeof req.user.username === 'string') { req.page.props.auth = true; }
  next();
});

// app.use(session({keys: ['secret_cat']}));

// app.use(passport.initialize());
// app.use(passport.session());

// var Account = require('./UserModel.js');
// passport.use(new LocalStrategy(Account.authenticate()));

// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

/*
var loginPlus = new (require('login-plus').Manager);
loginPlus.init(app, { successRedirect:'/admin', loginUrlPath : '/login'
});
*/

/*
loginPlus.setValidatorStrategy(
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
            return done(null, {username: user.username, when: Date()});
        });
    }
);
*/

/*
loginPlus.setValidatorStrategy(
    function(username, password, done) {
        alert('functo called');
        if(username == "nick" && password == "pass") {
            return done(null, {username: username, when: Date()});
        }
        else {
            done('username or password error');
        }
    }
)
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', view_routes);
app.use('/prefixes', prefix_routes);
app.use('/report', report_routes);
app.use('/upload', upload_routes);
app.use('/catalog', catalog_routes);
app.use('/login', login_routes);
app.use('/admin', admin_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// **Error Handlers**

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;