var bcrypt = require('bcrypt');
var dotenv = require('dotenv');

var router = require('express').Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'peer2package'
});

var r = require('rethinkdb');

var jwt = require('jsonwebtoken');

var http = require('http');

var io = require('socket.io')(http);

dotenv.load();

const salt = process.env.BCRYPT_SALT;

var lng = '';
var lat = '';
var uname = '';
var email = '';
var fname = '';
var lname = '';
var location = null;
var myPosition = '';
var generatedKeys = ''

// CONNECT TO ReThinkDB
  var rethinkdb = null;
  r.connect({host: 'localhost', port: 28015, db: 'peer2package'}, function (err, conn) {
    if (err) throw err;
    rethinkdb = conn;
  });

// CONFIGURE ROUTES
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    var insertQuery = 'SELECT * FROM users WHERE email="'+req.session.user.email+'";';
    connection.query(insertQuery, function(err, rows) {
      if (err) throw err;
      if (rows.length) {
        if (rows[0].pword === req.session.user.pword) {
          user.email = rows[0].email
          user.fname = rows[0].fname
          user.lname = rows[0].lname
          user.pword = rows[0].pword
          user.token = jwt.sign(user, process.env.JWT_SECRET);
          res.locals.user = user;
          console.log(user)
          res.send({token: user.token});
        } else {
          req.session.reset();
          res.sendFile('index.html');
        }
      } else {
        req.session.reset();
        res.sendFile('index.html');
      }
    })
  } else {
    res.sendFile('index.html');
  }
});

router.post('/register', function (req, res) {
  console.log(req.session);
  var user = {}
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
        console.log('Registration successful!');
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

router.post('/login', function (req, res) {
  console.log(req.session);
  var testUser = req.body
  var user = {}
  var hash = bcrypt.hashSync(testUser.password, salt);
  testUser.password = hash;
  var insertQuery = 'SELECT * FROM users WHERE email="'+testUser.email+'";';
  connection.query(insertQuery, function(err, rows) {
    if (err) throw err;
    if (rows.length) {
      if (rows[0].pword === testUser.password) {
        console.log('User logged in successfully!');
        user.email = rows[0].email
        user.fname = rows[0].fname
        user.lname = rows[0].lname
        user.pword = rows[0].pword
        user.token = jwt.sign(user, process.env.JWT_SECRET);
        req.session.user = user
        console.log(user)
        res.send({token: user.token});
      } else {
        console.log('The password is incorrect.')
        res.send({message: 'The password is incorrect!'})
      }
    } else {
      console.log('That email does not exist.')
      res.send({message: 'That email does not exist.'})
    }
  })
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
})

router.post('/delete', function (req, res) {
  var user = req.body
  var insertQuery = 'DELETE FROM users WHERE id="' + user.id + '";'
  connection.query(insertQuery, function (err, rows) {
    if (err) throw err;
    if (rows.length) {
      console.log('User deleted');
      res.send({
        message: 'User deleted.'
      })
    }
  })
});


router.get('/map', function (req, res) {
  res.sendFile(__dirname + '/public/map.html');
});

router.get('/other_positions', function (req, res) {
  r.table('locations').get(generatedKeys).run(rethinkdb, function(err, result) {
    if (err) throw err;
    if (result) {
      lng = result.lng;
      lat = result.lat;
    }
  })
  console.log('longitude:' + lng + ', latitude:' + lat);
});

router.get('/user_location', function (req, res) {
  r.table('locations').get(generatedKeys).run(rethinkdb, function(err, result) {
    if (err) throw err;
    if (result) {
      lng = result.lng;
      lat = result.lat;
    }
  })

  res.send({
    "geometry": {
      "type": "Point",
      "coordinates": [ lng, lat ]
    },
    "type": "Feature",
    "properties": {
      "title": "You",
      "description": "<style>div.profile > img{height:70px;width:70px;}div.mapboxgl-popup {padding:10px;width:50%;background-color:#1C283B;border-radius:4px;margin-top:-80px;align-self:flex-start;}div.profile > span#userName{margin-right:10px}</style><div class='profile'><img src='../img/profile.gif' /><span#userName> " + uname + " </h1></div>"
    }
  });
});

module.exports = router;
