
const networkingConsts = require('consts').consts;
const PORT = networkingConsts.PORT;

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
