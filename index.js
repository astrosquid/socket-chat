
const consts = require('./consts'); // needed to be pointed at a specific file.
const PORT = consts.networkingConsts.PORT;
console.log('port is: ' + PORT);

//var express = require('express');
//var json = require('express-json');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const qs = require('querystring');
var bodyParser = require('body-parser');

var clients = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//app.use(json);

/*
This function is from https://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js and will be called when we need to see if a user is still logged in. If they aren't, deny access. If they are, bring them to the requested service. To be changed when handling tokens.
function checkAuth(req, res, next)
{
	if (!req.session.user_id) {
		res.send('Access denied.');
	} else {
		next();
	}
}
*/

const acceptedusers = {
  'chris': 'donut',
  'steve': 'nadgerz'
};

app.post('/checkUserLogin', function (req, res) {
	console.log('Request received.');
	var username = req.body.username;
	console.log('username is: ' + username);

	if (acceptedusers.hasOwnProperty(username))
	{
		console.log('user is in accepted users object');
		if (acceptedusers[username] === req.body.password)
		{
			console.log('User accepted');
			res.status(200).send("{}");
			return;
		}
	}

	res.status(400).send('You done goofed.');
});

app.get('/login', function (req, res)
{
	console.log('someone hit the login page');
	res.sendFile(__dirname + '/login.html');
});

app.get('/chat', function (req, res)
{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket)
{
	const userid = socket.id;
  const messagePack = {};
  const now = new Date();
  // I'm removing the timestamp here for two reasons.
  // One is that none of the implementations I can find are simple enough to warrant caring anymore.
  // Second, we don't care how the server perceives time. We'll just grab the milliseconds later to keep in the db. Convert on the fly as needed, etc.
  //const timestamp = ('0' + now.getHours().slice(-2) + ':' + '0' + now.getMinutes().slice(-2) );

  //messagePack.time = timestamp;
  messagePack.author = 'System';
  messagePack.message = socket.id;
  socket.emit('hi there', messagePack);

  messagePack.message = 'A visitor approaches with ID ' + socket.id;
  clients.push(socket);
  io.emit('chat message', messagePack);

  // endpoint
  socket.on('chat message', function (msg)
  {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
  	console.info(socket.id + ' walked away.');
  	//messagePack.time = timestamp;
    messagePack.author = 'System';
    messagePack.message = 'A visitor with ID ' + socket.id + ' walks away.';
    io.emit('chat message', messagePack);
  });
});

http.listen(PORT, function ()
{
  console.log('listening on *:' + PORT);
});
