from flask import Flask
from flask_cors import CORS
from flask import make_response
from flask import request
from flask import abort

import os
import json
import datetime
import sys
import errno

app = Flask(__name__)
CORS(app)

DIR_PATH = "/root/mix_scripts/"
TREE_DIR_PATH =  "/root/xran-box/"

@app.route('/')
def hello():
    return "Hello World!"

'''
    Retrieve single <file> inside <folder>
'''
# File is the target file inside the folder
@app.route('/file', methods=['GET'])
def get_file():
    p = request.args.get('path')
    f = request.args.get('file')
    try:
      with open(os.path.join(p, f), 'r') as file: 
          return file.read(), 200
    except IOError:
      abort(404)


'''
    Return formatted modification time of specified file
'''
@app.route('/file/mtime', methods=['GET'])
def get_mtime():
    p = request.args.get('path')
    f = request.args.get('file')
    mtime_raw = os.path.getmtime(os.path.join(p, f))
    mod_timestamp = str(datetime.datetime.fromtimestamp(mtime_raw))
    return mod_timestamp, 200

'''
    Return the list of filenames inside specified folder
'''
@app.route('/list/<name>', methods=['GET'])
def list_files(name):
    files_list = [] 
    for f in os.listdir(DIR_PATH + name):
        if os.path.isfile(DIR_PATH + name + '/' + f):
            files_list.append(f)
    return json.dumps(files_list), 200    


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

'''
  Retrieve the tree in JSON format given the parent folder path.
'''
@app.route('/tree', methods=['GET'])
def get_dir_tree():
  parent_path = TREE_DIR_PATH
  hierarchy = path_hierarchy(parent_path)
  return json.dumps([hierarchy]), 200

def path_hierarchy(path):
  hierarchy = {'type': 'folder','name': os.path.basename(path), 'path': path}

  try:
    hierarchy['children'] = [ path_hierarchy(os.path.join(path, contents)) for contents in os.listdir(path) if not contents.startswith('.') ]
  except OSError as e:
    if e.errno != errno.ENOTDIR:
      raise
    hierarchy['type'] = 'file'

  return hierarchy


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
