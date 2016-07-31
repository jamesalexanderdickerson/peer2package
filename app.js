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
  res.sendFile(__dirname + '/public/map.html');
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
      "description": "<p>This is your current location.</p>"
    }
  }
);
});

io.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('LngLat', function (yourPosition) {
  myPosition = yourPosition.split(',');
  console.log(myPosition);
  })
  socket.on('disconnect', function () {
    console.log('A user has disconnected');
  })
});

http.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
