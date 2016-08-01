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
      "description": "<style>div.mapboxgl-popup {padding:10px;max-width:400px;background-color:#1C283B;font:20px'Helvetica Neue',Arial,Helvetica,sans-serif;border-radius:4px;margin-top:-50px;}button.mapboxgl-popup-close-button {display:none;}button{background-color:rgba(0, 0, 0, 0);color:#D6842D;border:1px solid #D6842D;}svg{margin:0 41% 0 ;display:block;position:absolute}</style><p>This is your current location.</p><br /><form><textarea rows='4' cols='50'>Enter text here.</textarea><br /><button type='submit'>Submit</button></form><svg xmlns='http://www.w3.org/2000/svg' width='54.875' height='29.875' viewBox='0 0 54.875 29.875'><path fill='#1C283B' d='M.916-.333l53.81.214L26.916 30z'/></svg>"
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
