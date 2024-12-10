from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    emit('message', f"{username} has joined the room {room}!", room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('message', f"{username} has left the room {room}!", room=room)

@socketio.on('sync-player')
def sync_player(data):
    action = data['action']
    song = data.get('song', '')
    room = data['room']  # Make sure you send the room data from frontend

    # Emit the sync event to all clients in the room
    emit('sync-player', {'action': action, 'song': song}, room=room)

if __name__ == "__main__":
    socketio.run(app, debug=True)
