from flask import Flask, request
from MicroServices.Executor.deploy import run_command
from endpoint import Endpoint

app = Flask(__name__)


@app.route('/execute')
def execute():
    data = request.form
    return run_command(Endpoint(data['ip_address'], data['username'], data['password']), data.process, data.command)
