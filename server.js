const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

let messageCount = 0; // To track message number

// Define the word-to-emoji mapping
const emojiMap = {
    'hey': '🤚',
    'react': '⚛️',
    'hello': '👋',
    'thanks': '🙏',
    'goodbye': '👋🏼',
};

// Function to replace words with emojis
function replaceWordsWithEmojis(msg) {
    // Iterate over each word in the emoji map and replace it in the message
    Object.keys(emojiMap).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');  // Match word case-insensitively
        msg = msg.replace(regex, emojiMap[word]);
    });
    return msg;
}

// Event listener for new client connections
io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle incoming messages from clients
    socket.on('chat message', (msg) => {
        // Replace words with emojis
        const messageWithEmojis = replaceWordsWithEmojis(msg);

        // Alternate message sender (odd: user, even: other participant)
        messageCount++;
        const sender = messageCount % 2 === 1 ? 'user' : 'other';
        io.emit('chat message', { msg: messageWithEmojis, sender }); // Send message with emojis and sender info
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
