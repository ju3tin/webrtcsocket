const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow your GitHub Pages site
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for a message from the client
    socket.on('message', (msg) => {
        console.log('Message received: ', msg);

        // Broadcast the message to all clients
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});