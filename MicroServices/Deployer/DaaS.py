import flask
from flask import request, abort, jsonify, json
import werkzeug
import subprocess as sp
app = flask.Flask(__name__)
app.config["DEBUG"] = False

@app.route('/deploy', methods=['POST'])
def deploy():
    if request.json:
        if not 'package' in request.json or not 'status' in request.json:
            abort(400)
        else:
            return "recieved status"
    elif not 'package' in request.form or not 'status' in request.form:
            abort(400)
    else:
        return "recieved status"




@app.route('/')
def index():
	return "echo"
app.run(host="0.0.0.0", port=5000)
