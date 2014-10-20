var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var Twit = require('twit');

var routes = require('./routes/index');
var users = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
 
var T = new Twit({
    consumer_key        : process.env.consumer_key,
    consumer_secret     : process.env.consumer_secret,
    access_token        : process.env.access_token,
    access_token_secret : process.env.access_token_secret
})
app.get('/', function(req, res){
    res.sendFile('index.hjs', {"root": __dirname});
});

http.listen(3000, function(){
  console.log("Listening for tweets from Toronto...");
});

var stream = T.stream('statuses/filter', { locations: [-79,43,-78.5,44] });

io.on('connection', function (socket) {
    socket.on('bound_change', function (corners) {
        console.log(corners.sw.lat);
        console.log("Changing twitter stream...");
        stream.stop();
        stream = T.stream('statuses/filter', { locations: [-122.75,36.8,-121.75,37.8] });
    })
})


stream.on('connect', function (request) {
    console.log('Connected to Twitter API');
});
 
stream.on('disconnect', function (message) {
    console.log('Disconnected from Twitter API. Message: ' + message);
});
 
stream.on('reconnect', function (request, response, connectInterval) {
  console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
})


stream.on('tweet', function (tweet) {
    if (tweet.geo == null) {
        return;
    }
 
    //Create message containing tweet + username + profile pic + location
    var twt = {};
    twt.text = tweet.text;
    twt.geo = tweet.geo.coordinates;
    twt.user = {
        name: tweet.user.name,
        image: tweet.user.profile_image_url
    }
    twt.id = tweet.id_str;
    twt.userID = tweet.user.id_str;
    io.sockets.emit('tweets', twt);
});



