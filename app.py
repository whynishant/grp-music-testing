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
    emit('message', {'msg': f"{username} has joined the room {room}!"}, to=room)


@socketio.on('player-state-change')
def on_player_state_change(data):
    room = data['room']
    action = data['action']

    # Emit player state change to all users in the room
    emit('player-state-change', {'action': action, 'room': room}, to=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('message', {'msg': f"{username} has left the room {room}!"}, to=room)


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5003)
