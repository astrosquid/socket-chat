
const consts = require('./consts'); // needed to be pointed at a specific file.
console.log(consts);
const PORT = consts.networkingConsts.PORT;
console.log('port is: ' + PORT);

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/*
const acceptedusers = {
    'chris': 'donut',
    'steve': 'nadgerz'
};

const acceptedUsers = ['chris', 'steve'];
*/

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

app.get('/chat', function (req, res)
{
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', function (req, res)
{
	res.sendFile(__dirname + '/login.html');
});

io.on('connection', function (socket)
{
    const messagePack = {};

    const now = new Date();
    const timestamp = now.getHours() + ':' + now.getMinutes();

    messagePack.time = timestamp;
    messagePack.author = 'SYSTEM';
    messagePack.message = 'A visitor approaches...';

    console.log('someone connected...');
    io.emit('chat message', messagePack);

    // endpoint
    socket.on('chat message', function (msg)
    {
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
