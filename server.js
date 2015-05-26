var EyeTribeClient = require('eyetribe-client');

// Express.js + Socket.io setup
// http://socket.io/docs/#using-with-express-3/4
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Static file server
// http://expressjs.com/starter/static-files.html
app.use(express.static('public'));

// Serve client application
// http://expressjs.com/4x/api.html#res.sendFile
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

// The Eye Tribe
var eye = new EyeTribeClient();
eye.activate({}, function (err) {
  if (err) { console.error(err); return; }
});
eye.on('gazeUpdate', function (gazeData) {
  io.sockets.emit('gazeUpdate', gazeData);
});

// Start the server
server.listen(8888);
console.log('Up and running @ localhost:8888');
