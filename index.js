const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your GitHub Pages URL
        methods: ["GET", "POST"],
    },
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello, this is your GET API response!' });
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Relay signaling messages
    socket.on('signal', (data) => {
        const { to, signal } = data;
        io.to(to).emit('signal', { from: socket.id, signal });
    });

    socket.on('message', (msg) => {
        console.log('Message received: ', msg);
        io.emit('message', msg); // Broadcast to all clients
    });

    // Notify others of disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});