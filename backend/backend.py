from flask import Flask
from flask_cors import CORS

import os
import json
import datetime

app = Flask(__name__)
CORS(app)

DIR_PATH = "/root/md_files/"

@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>', methods=['GET'])
def get_file(name):
    with open(DIR_PATH + name, 'r') as f: 
        return f.read(), 200

@app.route('/<name>/mtime', methods=['GET'])
def get_mtime(name):
    mtime_raw = os.path.getmtime(DIR_PATH + name)
    mod_timestamp = str(datetime.datetime.fromtimestamp(mtime_raw))
    return mod_timestamp, 200

@app.route('/list', methods=['GET'])
def list_files():
    return json.dumps(os.listdir(DIR_PATH)), 200    


if __name__ == '__main__':
    app.run(host='0.0.0.0')
