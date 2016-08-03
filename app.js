// Require/import libraries.
var app = require('express')(),
  express = require('express'),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(http),
  mongoose = require('mongoose'),
  dotenv = require('dotenv');

// Import variables from .env file.
dotenv.load();
mongoose.connect('mongodb://localhost/peer2package', function () {
  console.log('Connected to mongodb.');
});

var Schema = mongoose.Schema;

var positionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  coordinates: {
    lat: {
      type: String
    },
    lng: {
      type: String
    }
  }
});

var Position = mongoose.model('Position', positionSchema);

// Define a port we want to use.
const PORT=8080;
var myPosition = '';

// Load in environment variables.
var mapboxAPIKey = process.env.MAPBOXAPIKEY

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/map', function (req, res) {
  var user = Position({
    userId: 'adjklgkjalgkjdg',
    username: 'jamesadickerson',
    coordinates: {
      lat: myPosition[0],
      lng: myPosition[1],
    }
  });
  if (!Position({userId: 'adjklgkjalgkjdg'})) {
    user.save(function (err) {
      if (err) throw err;
      console.log('User created!');
    });
  }
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
      "coordinates": [myPosition[0],myPosition[1]]
    },
    "type": "Feature",
    "properties": {
      "title": "You",
      "description": "<style>div.profile{display:flex;width:100%;justify-content:space-between;}div.profile > img{height:70px;width:70px;}div.mapboxgl-popup {padding:10px;max-width:400px;background-color:#1C283B;font:20px'Helvetica Neue',Arial,Helvetica,sans-serif;border-radius:4px;margin-top:-50px;align-self:flex-start;}h1{align-self:flex-end;font-size:1.5em;}button.mapboxgl-popup-close-button {display:none;}svg{margin:0 41% 0 ;display:block;position:absolute}</style><div class='profile'><img src='../img/profile.gif' /><h1> John Smith </h1></div><p>This is your current location.</p><br /><svg xmlns='http://www.w3.org/2000/svg' width='54.875' height='29.875' viewBox='0 0 54.875 29.875'><path fill='#1C283B' d='M.916-.333l53.81.214L26.916 30z'/></svg>"
    }
  });
});

io.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('LngLat', function (yourPosition) {
  myPosition = yourPosition.split(',');
  console.log(myPosition);
  Position.update({ userId: 'adjklgkjalgkjdg' }, {
    coordinates: {
        lat: myPosition[0],
        lng: myPosition[1],
    }, function (err) {
      if (err) throw err;
    }
  });
  })
  socket.on('disconnect', function () {
    console.log('A user has disconnected');
  })
});

http.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
