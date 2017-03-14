var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var acceptedusers = {
	"chris": "donut",
	"steve": "nadgerz"
}

var acceptedUsers = ['chris', 'steve'];

app.get('/chat', function(req, res) {
 res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	var messagePack = {};

	var now = new Date()
  var timestamp = now.getHours() + ':' + now.getMinutes();

	messagePack.time = timestamp;
	messagePack.author = 'SYSTEM';
	messagePack.message = 'A visitor approaches...';

	console.log('someone connected...');
	io.emit('chat message', messagePack);

	// endpoint
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
}).on('disconnect', function(socket) {
	console.log('user left.');
});

http.listen(3000, function(){
 console.log('listening on *:3000');
});
