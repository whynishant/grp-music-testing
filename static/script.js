const socket = io(); // Connect to the server using Socket.IO

let currentRoom = ''; // Store the current room
let playerState = 'paused'; // Track current state of the music (play or pause)

// Emit the 'join' event when a user joins a room
document.getElementById('join-room').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;

    if (username && room) {
        // Emit a 'join' event to the server
        socket.emit('join', { username, room });

        currentRoom = room; // Store the current room

        // Show the playlist after joining
        document.getElementById('join-container').style.display = 'none';
        document.getElementById('music-container').style.display = 'block';
    } else {
        alert('Please enter both a username and a room.');
    }
});

// Listen for state changes (play, pause) from other users
socket.on('player-state-change', (data) => {
    if (data.room === currentRoom) {
        if (data.action === 'play') {
            document.getElementById('spotify-player').contentWindow.postMessage('{"method":"play"}', '*');
            playerState = 'playing';
        } else if (data.action === 'pause') {
            document.getElementById('spotify-player').contentWindow.postMessage('{"method":"pause"}', '*');
            playerState = 'paused';
        }
    }
});

// Function to emit play/pause action to the server
function syncPlayerState(action) {
    socket.emit('player-state-change', {
        action,
        room: currentRoom,
    });
}

// Play button listener
document.getElementById('play-button').addEventListener('click', () => {
    if (playerState === 'paused') {
        syncPlayerState('play');
        playerState = 'playing';
    }
});

// Pause button listener
document.getElementById('pause-button').addEventListener('click', () => {
    if (playerState === 'playing') {
        syncPlayerState('pause');
        playerState = 'paused';
    }
});
