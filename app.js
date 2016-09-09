// REQUIRE/IMPORT LIBRARIES
var app = require('express')(),
  express = require('express'),
  flash = require('connect-flash'),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  mongodb = require('mongodb'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  io = require('socket.io')(http),
  bcrypt = require('bcrypt'),
  r = require('rethinkdb'),
  jwt = require('jsonwebtoken'),
  routes = require('./routes'),
  dotenv = require('dotenv');

  // CONNECT TO ReThinkDB
    var rethinkdb = null;
    r.connect({host: 'localhost', port: 28015, db: 'peer2package'}, function (err, conn) {
      if (err) throw err;
      rethinkdb = conn;
    });

  // CONNECT TO MongoDB
  mongoose.connect('mongodb://localhost/peer2package');

  var Locations = mongoose.model('Location', {email: String, lng: Number, lat: Number});

  // IMPORT VARIABLES FROM .ENV FILE
  dotenv.load();

  // BCRYPT PASSWORD HASHING
  const salt = process.env.BCRYPT_SALT;
  //const salt = bcrypt.genSaltSync(10);

  var lng = '';
  var lat = '';
  var uname = '';
  var email = '';
  var fname = '';
  var lname = '';
  var myPosition = '';
  var generatedKeys = ''

// DEFINE A PORT WE WANT TO USE
const PORT=8000;

// LOAD IN ENVIRONMENT VARIABLES
const secret = process.env.JWT_SECRET;

// CONFIGURE APP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(session({
  store: new RedisStore(),
  secret: 'sssshhhhhhhhhhhhhhh!',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));
app.use(logger('dev'));

function ensureAuthorized(req, res, next) {
  var bearerToken
  var bearerHeader = req.headers["authorization"]
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ")
    bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.send(403)
  }
}

app.use(logger('dev'));
app.use('/', routes);

// SOCKET.IO
io.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('LngLat', function (yourPosition) {
    myPosition = yourPosition.split(',');
    r.table('locations').insert({
        lng: myPosition[0],
        lat: myPosition[1]
    }).run(rethinkdb).then(function (response) {
      var genKey = JSON.stringify(response.generated_keys).replace(/[[\]]/g,'');
      generatedKeys = genKey.replace(/"/g, '');
    }).error(function (err) {
      console.log('error occured', err);
    });
  });
  socket.on('chat message', function (message) {
    console.log(uname + ': ' + message.message)
    io.emit('chat message', message.message)
  })
  socket.on('disconnect', function () {
    console.log('A user has disconnected');
  })
});

// SERVER
http.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
