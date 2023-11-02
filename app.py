from chatterbot import ChatBot
from main import bot_response
from flask import Flask, render_template, request

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run()