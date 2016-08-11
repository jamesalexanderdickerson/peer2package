// Require/import libraries.
var app = require('express')(),
  express = require('express'),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(http),
  bcrypt = require('bcrypt'),
  Sequelize = require('sequelize'),
  redis = require('redis'),
  r = require('rethinkdbdash')({
    port: 28015,
    host: 'localhost',
    db: 'peer2package'
  }),
  Session = require('express-session'),
  cookieParser = require('cookie-parser'),
  redisClient = redis.createClient(),
  dotenv = require('dotenv');

// Bcrypt password hashing
const salt = bcrypt.genSaltSync(10)

// Import variables from .env file.
dotenv.load();

var lng = '';
var lat = '';

// Define a port we want to use.
const PORT=8000;
var myPosition = '';

// Load in environment variables.
var mapboxAPIKey = process.env.MAPBOXAPIKEY

// Setup MySQL
var sequelize = new Sequelize('peer2package', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var User = sequelize.define('user', {
  eMail: {
    type: Sequelize.INTEGER(11),
    field: 'email',
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING(50),
    field: 'fname',
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING(50),
    field: 'lname',
    allowNull: false
  },
  passWord: {
    type: Sequelize.STRING(90),
    field: 'pword',
    allowNull: false
  }
}, { timestamps: false });

// Setup Redis
redisClient.on('connect', function () {
  console.log('connected to redis');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

var Session = Session({
  secret: 'shhhhhhhhhhhhh!!!!!',
  saveUnintialized: true,
  resave: true
});

io.use(function (socket, next) {
  Session(socket.request, socket.request.res, next);
});

app.use(Session);

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/register', function (req, res) {
  var email = req.body.email;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var pword = bcrypt.hashSync(req.body.password, salt);
  User.build({
    eMail: email,
    firstName: fname,
    lastName: lname,
    passWord: pword
  }).save();
  console.log(pword);
  res.end()
});

app.post('/login', function (req, res) {
  var email = req.body.email
  var pword = bcrypt.hashSync(req.body.password, salt);
  res.end()
})

app.get('/map', function (req, res) {
  res.sendFile(__dirname + '/public/map.html');
});

app.get('/other_positions', function (req, res) {
  Position.find({}, function(err, positions) {
    if (err) throw err;
    console.log(positions);
  });
});

app.get('/user_location', function (req, res) {
  res.json({
    "geometry": {
      "type": "Point",
      "coordinates": [ lng,lat ]
    },
    "type": "Feature",
    "properties": {
      "title": "You",
      "description": "<style>div.profile{display:flex;width:100%;justify-content:space-between;}div.profile > img{height:70px;width:70px;}div.mapboxgl-popup {padding:10px;max-width:400px;background-color:#1C283B;font:20px'Helvetica Neue',Arial,Helvetica,sans-serif;border-radius:4px;margin-top:-80px;align-self:flex-start;}h1{align-self:flex-end;font-size:1.5em;}button.mapboxgl-popup-close-button {display:none;}svg{margin:0 41% 0 ;display:block;position:absolute}</style><div class='profile'><img src='../img/profile.gif' /><h1> John Smith </h1></div><p>This is your current location.</p><br /><svg xmlns='http://www.w3.org/2000/svg' width='54.875' height='29.875' viewBox='0 0 54.875 29.875'><path fill='#1C283B' d='M.916-.333l53.81.214L26.916 30z'/></svg>"
    }
  });
});

io.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('LngLat', function (yourPosition) {
    myPosition = yourPosition.split(',');
    console.log(myPosition);
    r.table('locations').insert({
      lng: myPosition[0],
      lat: myPosition[1]
    }).run().then(function (response) {
      console.log(response);
    }).error(function (err) {
      console.log('error occured', err);
    });
  });
  socket.on('disconnect', function () {
    console.log('A user has disconnected');
  })
});

http.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
