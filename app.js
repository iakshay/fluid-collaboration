
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
});