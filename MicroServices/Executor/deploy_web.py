from flask import Flask, request, jsonify
from celery import Celery

from MicroServices.Executor.deploy import run_command
from endpoint import Endpoint

app = Flask(__name__)


# def make_celery(app):
#     celery = Celery(
#         app.import_name,
#         backend=app.config['CELERY_RESULT_BACKEND'],
#         broker=app.config['CELERY_BROKER_URL']
#     )
#     celery.conf.update(app.config)
#
#     class ContextTask(celery.Task):
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return self.run(*args, **kwargs)
#
#     celery.Task = ContextTask
#     return celery
#
#
# celery = make_celery(app)


@app.route('/execute', methods=['POST'])
def execute():
    data = request.form
    print(data)

    rc, out, err = run_command(Endpoint(data['ip_address'], data['username'], data['password']), data['process'],
                               data['command'])
    print(rc, out.decode(), err.decode())
    return jsonify(rc=rc, out=out.decode(), err=err.decode())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
