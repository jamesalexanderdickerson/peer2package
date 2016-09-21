// REQUIRE/IMPORT LIBRARIES
var app = require('express')(),
  express = require('express'),
  flash = require('connect-flash'),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  bcrypt = require('bcrypt'),
  r = require('rethinkdb'),
  mysql = require('mysql'),
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'peer2package'
  }),

  mongodb = require('mongodb'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  dotenv = require('dotenv');


  // IMPORT VARIABLES FROM .ENV FILE
  dotenv.load();

  // BCRYPT PASSWORD HASHING
  const salt = process.env.BCRYPT_SALT;
  //const salt = bcrypt.genSaltSync(10);

  var lng = '';
  var lat = '';
  var user = {};
  var email = '';
  var myPosition = '';
  var generatedKeys = ''

// DEFINE A PORT WE WANT TO USE
const PORT=8000;

// LOAD IN ENVIRONMENT VARIABLES
const secret = process.env.JWT_SECRET;

// CONNECT TO MongoDB
mongoose.connect('mongodb://localhost/peer2package');
var LocationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lng: String,
  lat: String
});
var Location = mongoose.model('Location', LocationSchema);

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connection established')
})


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


// CONFIGURE ROUTES
app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.post('/register', function (req, res) {
  user.email = req.body.email;
  user.fname = req.body.fname;
  user.lname = req.body.lname;
  user.pword = bcrypt.hashSync(req.body.password, salt);
  var insertQuery = 'SELECT * FROM users WHERE email="'+user.email+'";';
  connection.query(insertQuery, function(err, rows) {
    if (err) {
      res.send(err);
    }
    if (rows.length) {
        res.send({message: 'That email is already in use!'});
    } else {
      var newQuery = 'INSERT INTO users (email, fname, lname, pword) VALUES ("'+user.email+'","'+user.fname+'","'+user.lname+'","'+user.pword+'");';
      connection.query(newQuery, function(err, rows) {
        delete user.pword;
        user.token = jwt.sign(user, process.env.JWT_SECRET);
        req.session.user = user;
        uname = user.fname + ' ' + user.lname;
        email = user.email;
        fname = user.fname;
        lname = user.lname;
        res.send({token: user.token});
      })
    }
  })
});

app.post('/login', function (req, res) {
  var testUser = req.body
  var hash = bcrypt.hashSync(testUser.password, salt);
  testUser.password = hash;
  var insertQuery = 'SELECT * FROM users WHERE email="'+testUser.email+'";';
  connection.query(insertQuery, function(err, rows) {
    if (err) throw err;
    if (rows.length) {
      if (rows[0].pword === testUser.password) {
        user.email = rows[0].email
        user.fname = rows[0].fname
        user.lname = rows[0].lname
        user.token = jwt.sign(user, process.env.JWT_SECRET);
        res.send({token: user.token});
      } else {
        res.send({message: 'The password is incorrect!'})
      }
    } else {
      res.send({message: 'That email does not exist.'})
    }
  })
});

app.get('/logout', function(req, res) {
  Location.remove({email:email}, function (err) {
    if (err) throw err;
  });
  res.redirect('/');
})

app.post('/delete', function (req, res) {
  var user = req.body
  var insertQuery = 'DELETE FROM users WHERE id="' + user.id + '";'
  connection.query(insertQuery, function (err, rows) {
    if (err) throw err;
    if (rows.length) {
      res.send({
        message: 'User deleted.'
      })
    }
  })
});


app.get('/map', function (req, res) {
  res.sendFile(__dirname + '/public/map.html');
});

app.get('/users', function (req, res) {
  names = [];
  insertQuery = "SELECT * FROM users;";
  connection.query(insertQuery, function (err, rows) {
    if (err) throw err;
    if (rows.length) {
      for (var i in rows) {
        email = rows[i].email;
        fname = rows[i].fname;
        lname = rows[i].lname;
        name = fname + ' ' + lname;
        user = {email:email,name:name};
        names.push(user);
      }
      console.log(names);
      res.send({
        names
      })
    }
  })
});

app.get('/locations', function (req, res) {

  var uname = user.fname + ' ' + user.lname;

  Location.find({}, function(err, location) {
    if (err) throw err;
    var locations = [];
    locations.push(JSON.parse(JSON.stringify(location)));
    locations = locations[0];
    var points = '{ "type":"FeatureCollection","features":[';
    var json = '';
    for (i = 0; i < locations.length; i++) {
      if (locations[i].email === email) {
        json += '{"type":"Feature","geometry":{"type":"Point","coordinates":[' + locations[i].lng + ',' + locations[i].lat + ']},"type":"Feature","properties":{"title":"You", "icon": "car", "description":"<style>div.profile > img{height:70px;width:70px;}div.mapboxgl-popup {padding:10px;width:50%;background-color:#1C283B;border-radius:4px;margin-top:-80px;align-self:flex-start;}img{height:50px;width:50px;}div.profile > span#userName{margin-right:10px}</style><img src=\'../img/profile.gif\' ><span#userName> '+ uname + ' </span><div id=\'chat_menu\'><div id=\'chat_button\'><button "}}';
      } else {
        json += '{"type":"Feature","geometry":{"type":"Point","coordinates":[' + locations[i].lng + ',' + locations[i].lat + ']},"type":"Feature","properties":{"title":"A Person", "icon": "car2", "description":"<style>div.profile > img{height:70px;width:70px;}div.mapboxgl-popup {padding:10px;width:50%;background-color:#1C283B;border-radius:4px;margin-top:-80px;align-self:flex-start;}div.profile > span#userName{margin-right:10px}</style><span#userName> '+ locations[i].email + ' </span>"}}';
      }
      if (i < locations.length -1) {
        json += ','
      }
      points += json
    }
    points += ']}'
    points = JSON.parse(points);
    res.send(points)
  });

  // console.log(points)
});

// SOCKET.IO
io.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('LngLat', function (yourPosition) {
    myPosition = yourPosition.split(',');
    email = myPosition[0];
    lng = myPosition[1];
    lat = myPosition[2];
    if (email) {
      Location.findOneAndUpdate({email: email}, {lng: lng, lat: lat}, {upsert: true}, function (err, location) {
        if(err) throw err;
        console.log('location updated');
      });
    }

  });
  socket.on('chat message', function (message) {
    io.emit('chat message', message.message)
    console.log(message);
    insertQuery = 'INSERT INTO chat_messages (email, message, driver) VALUES ("' + message.from +'", "'+ message.message +'","' + message.to +'");';
    connection.query(insertQuery);

  })
  socket.on('disconnect', function () {
    console.log('A user has disconnected');
  })
});

// SERVER
http.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
