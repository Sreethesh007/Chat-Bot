from chatterbot import ChatBot
from main import bot_response
from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)
app.static_folder = 'static'

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    response = ""
    query = request.args.get('msg')
    response = bot_response(query)
    
    return str(response)

@socketio.on('message')
def handle_message(data):
    query = data['message']
    response = bot_response(query)
    socketio.emit('bot_response', {'message': str(response)})

if __name__ == "__main__":
    socketio.run(app)