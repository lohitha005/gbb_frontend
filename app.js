var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port     = process.env.PORT || 8080;
//var mongoose = require('mongoose');


var morgan       = require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');
var oauth=require('oauthio');
var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gnb'
});

connection.connect();

/*oauth.initialize('37Z_A85mXEV34h30TFfK9EKT9Rc', 'USs3HwD2-EhjPYGWqzT3R1E_WAE');

app.get('/oauth/token', function (req, res) {
    var token = oauth.generateStateToken(req.session);
    res.status(200).send({
        token:token
    });
});
app.post('/', function (req, res) {
    var code = req.body.code;
    // This sends the request to oauth.io to get an access token
    oauth.auth('facebook', req.session, {
        code: code
    })
        .then(function (r) {
            res.status(200).send(r);
        })
        .fail(function (e) {
            // Handle an error
            console.log(e);
            res.status(500).send('An error occured');
        });
});
app.get('/me', function (req, res) {
    oauth.auth('facebook', req.session)
        .then(function (request_object) {
            return request_object.me();
        })
        .then(function (profile) {
            req.session.user = profile;
            res.json(profile);
        })
        .fail(function (e) {
            // Handle an error
            console.log(e);
            res.status(500).send('An error occured');
        });
});*/
//mongoose.connect(configDB.url);
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'nil',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());
 // use connect-flash for flash messages stored in session

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("YES");
        return next();
    }else    res.sendStatus(401);
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



var http=require('http');
http.createServer(function (req, res) {

    if (req.method == 'POST') {
        var post_data = '';
        req.on('data', function (data) {
            post_data += data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('\n');

            console.log('RECEIVED THIS DATA:\n'+ post_data)

        });


    }
   /* else if (req.method == 'GET'){
         console.log(data);
         var post_data="";
        req.on('data', function (data) {
            post_data += data;
        });
        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('\n');

            console.log('RECEIVED THIS DATA:\n'+ post_data)

        });*/

    else
    {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('\n');
    }

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
module.exports = app;

