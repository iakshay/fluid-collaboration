
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config')
  , http = require('http')
  , path = require('path');

var app = express();


// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/:room', routes.room);


var io = require('socket.io').listen(app.listen(config.port));

io.sockets.on('connection', function (client) {
    // pass a message
    client.on('message', function (details) {
        var otherClient = io.sockets.sockets[details.to];

        if (!otherClient) {
            return;
        }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });

    client.on('join', function (name) {
        client.join(name);
        io.sockets.in(name).emit('joined', {
            room: name,
            id: client.id
        });
    });

    function leave() {
        var rooms = io.sockets.manager.roomClients[client.id];
        for (var name in rooms) {
            if (name) {
                io.sockets.in(name.slice(1)).emit('left', {
                    room: name,
                    id: client.id
                });
            }
        }
    }

    client.on('disconnect', leave);
    client.on('leave', leave);

    client.on('create', function (name, cb) {
        if (arguments.length == 2) {
            cb = (typeof cb == 'function') ? cb : function () {};
            name = name || uuid();
        } else {
            cb = name;
            name = uuid();
        }
        // check if exists
        if (io.sockets.clients(name).length) {
            cb('taken');
        } else {
            client.join(name);
            if (cb) cb(null, name);
        }
    });

    /* Multi - Room Chat */
    var users = [];

    function removeUser(name){
        users.forEach(function(userInfo, i){
            if(userInfo.name === name){
                users.splice(i, 1);
                return;
            }
        });
    }
    // when the client emits 'sendchat', this listens and executes
    client.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(client.info.room).emit('updatechat', client.info, data);
    });

    // when the client emits 'adduser', this listens and executes
    client.on('adduser', function(info){
        // we store the username in the client session for this client
        client.info = info;
        // add the client's username to the global list
        users.push(info);
        client.join(info.room);
        // echo to client they've connected
        client.emit('updatechat', 'SERVER', 'You have connected');
        // echo globally (all clients) that a person has connected
        client.broadcast.to(info.room).emit('updatechat', 'SERVER', info.name + ' has connected');
        // update the list of users in chat, client-side
        io.sockets.in(client.info.room).emit('updateusers', users);
    });

    // when the user disconnects.. perform this
    client.on('disconnect', function(){
        // remove the username from global usernames list
        removeUser(client.info.name);
        // update list of users in chat, client-side
        io.sockets.in(client.info.room).emit('updateusers', users);
        // echo globally that this client has left
        client.broadcast.to(client.info.room).emit('updatechat', 'SERVER', client.info.name + ' has disconnected');
    });
});