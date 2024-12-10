const socket = io(); // Connect to the server using Socket.IO

// Join the room when the user clicks the button
document.getElementById('join-room').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;

    if (username && room) {
        // Emit a 'join' event to the server
        socket.emit('join', { username, room });

        // Show the playlist after joining
        document.getElementById('room-container').style.display = 'none';
        document.getElementById('music-container').style.display = 'block';

        // Send an initial state of the music player to the server
        socket.emit('sync-player', { action: 'play', song: 'initialSong' }); // Play or pause action, and current song.
    } else {
        alert('Please enter both a username and a room.');
    }
});

// Listen for the 'sync-player' event from the server
socket.on('sync-player', (data) => {
    const action = data.action;
    const song = data.song;

    if (action === 'play') {
        playMusic(song); // Function to play music (You can call the play() method of the iframe)
    } else if (action === 'pause') {
        pauseMusic(); // Function to pause music
    } else if (action === 'skip') {
        skipSong(); // Skip current song
    }
});

// Function to play the song
function playMusic(song) {
    const spotifyIframe = document.getElementById('spotify-player');
    spotifyIframe.contentWindow.postMessage({ type: 'play' }, '*');
}

// Function to pause the song
function pauseMusic() {
    const spotifyIframe = document.getElementById('spotify-player');
    spotifyIframe.contentWindow.postMessage({ type: 'pause' }, '*');
}

// Function to skip the current song
function skipSong() {
    const spotifyIframe = document.getElementById('spotify-player');
    spotifyIframe.contentWindow.postMessage({ type: 'skip' }, '*');
}

// Listen for play, pause, and skip actions from the music player UI
document.getElementById('play-btn').addEventListener('click', () => {
    socket.emit('sync-player', { action: 'play', song: 'currentSong' });
});

document.getElementById('pause-btn').addEventListener('click', () => {
    socket.emit('sync-player', { action: 'pause' });
});

document.getElementById('skip-btn').addEventListener('click', () => {
    socket.emit('sync-player', { action: 'skip' });
});
