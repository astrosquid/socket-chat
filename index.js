
const consts = require('./consts'); // needed to be pointed at a specific file.
const PORT = consts.networkingConsts.PORT;
console.log('port is: ' + PORT);

//var express = require('express');
//var json = require('express-json');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const qs = require('querystring');
var bodyParser = require('body-parser');

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
    const messagePack = {};

    const now = new Date();
    const timestamp = now.getHours() + ':' + now.getMinutes();

    messagePack.time = timestamp;
    messagePack.author = 'SYSTEM';
    messagePack.message = 'A visitor approaches with ID number ' + socket.id;

    console.log('someone connected...');
    io.emit('chat message', messagePack);

    // endpoint
    socket.on('chat message', function (msg)
    {
    		if (msg.message.charAt(0) == '/') {
    			// execute slash commands

    		}
        io.emit('chat message', msg);
    });
}).on('disconnect', function (socket)
{
    console.log('user left.');
});

http.listen(PORT, function ()
{
    console.log('listening on *:' + PORT);
});
