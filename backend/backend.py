from flask import Flask
from flask_cors import CORS
from flask import make_response

import os
import json
import datetime

app = Flask(__name__)
CORS(app)

DIR_PATH = "/root/"

@app.route('/')
def hello():
    return "Hello World!"

'''
    Retrieve single <file> inside <folder>
'''
# File is the target file inside the folder
@app.route('/<folder>/<name>', methods=['GET'])
def get_file(folder, name):
    with open(DIR_PATH + folder + '/' + name, 'r') as f: 
        return f.read(), 200

'''
    Return formatted modification time of specified file
'''
@app.route('/<folder>/<name>/mtime', methods=['GET'])
def get_mtime(folder, name):
    mtime_raw = os.path.getmtime(DIR_PATH + folder + '/' + name)
    mod_timestamp = str(datetime.datetime.fromtimestamp(mtime_raw))
    return mod_timestamp, 200

'''
    Return the list of filenames inside specified folder
'''
@app.route('/list/<name>', methods=['GET'])
def list_files(name):
    return json.dumps(os.listdir(DIR_PATH + name)), 200    


'''
    Retrieve files from specified folder
    Note that base path is set to DIR_PATH
'''
@app.route('/<folder>', methods=['GET'])
def get_files(folder):
    ret = []
    for f in os.listdir(DIR_PATH + folder):
        print f
        with open(DIR_PATH + folder + '/' + f, 'r') as file_content:
            ret.append({'filename': f, 'content': file_content.read()})
    return json.dumps(ret), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0')
