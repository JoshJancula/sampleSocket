'use strict';
// Dependencies
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const db = require("./models");
const io = require('socket.io')(server);
const PORT = 8080;
const TestMessage = db.sequelize.import('./models/message.js');

// Set up app to use body parser for json encoding on POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

db.sequelize.sync().then(function () {
    server.listen(PORT, function () {
        console.log('---------------------------------------------------');
        console.log("App listening on PORT " + PORT);
        console.log('---------------------------------------------------');

        io.on('connection', (socket) => {
            // on connection get all messages
            TestMessage.findAll({
                where: {},
            }).then(function (messages) {
                socket.emit('message', {
                    messages
                });
            });

            socket.on('read', function(data) {
                TestMessage.update({ 
                    Read: data.Read
                  }, { 
                    where: {
                      id: data.id
                    }
                  }).then(function(x) {
                    console.log('message status updated');
                  })
                  .catch(function(err) {
                    res.json(err);
                  });
            });
        
            // when new message is created
            socket.on('message', function (data) {
                TestMessage.create({
                    Author: data.Author,
                    Recipient: data.Recipient,
                    Content: data.Content,
                    MessageType: data.MessageType,
                    Read: data.Read
                }).then(function (data) {
                    socket.emit('message', {
                        data
                    });
                    socket.broadcast.emit('message', {
                        data
                    });
                });
            });
        });
    });
});
