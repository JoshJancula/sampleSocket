'use strict';
// Dependencies
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const db = require("./models");
const io = require('socket.io')(server);
const PORT = 8080;

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

io.on('connection', (socket) => {

    // on connection get all messages
    app.get("/", function (req, res) {
        db.Testmessage.findAll({
            where: query,
        }).then(function (messages) {
            socket.broadcast.emit('message', {
                messages
            });
        });
    });
    
    // when new message is created
    socket.on('message', function (data) {
        // Store the data in the database.
        app.post("/", function (req, res) {
            db.Testmessage.create({
                Author: data.Author,
                Recipient: data.Recipient,
                Content: data.Content
            }).then(function (message) {
                // const newMessage = message.json()
                socket.broadcast.emit('message', {
                    message
                });
            });
        });
    });
});

db.sequelize.sync().then(function () {
    server.listen(PORT, function () {
        console.log('---------------------------------------------------');
        console.log("App listening on PORT " + PORT);
        console.log('---------------------------------------------------');
    });
});
