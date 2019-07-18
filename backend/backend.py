from flask import Flask
from flask_cors import CORS
from flask import make_response
from flask import request
from flask import abort

import time
import os
import json
import datetime
import sys
import errno
import subprocess

app = Flask(__name__)
CORS(app)

TREE_DIR_PATH =  "/root/xran-box/"

@app.route('/')
def hello():
    return "yo yo yo\n"

'''
    Retrieve single <file> inside <folder>
'''
# File is the target file inside the folder
@app.route('/file', methods=['GET', 'POST', 'DELETE'])
def handle_file():
  # Handle GET request
  if request.method == "GET":
    '''
    Retrieve file at specified path
    '''
    p = request.args.get('path')
    f = request.args.get('file')
    try:
      with open(os.path.join(p, f), 'r') as file: 
          return file.read(), 200
    except IOError:
      abort(404)
  # Handle POST request
  if request.method == "POST":
    '''
    Save received text into file
    NOTE: file is the full file path
    '''
    jsonData = request.get_json()
    file = jsonData['file']
    text = jsonData['text']
    with open(file, 'w+') as f:
      f.write(text)
    return json.dumps("ok"), 200
  # Handle DELETE request
  if request.method == "DELETE":
    '''
    Delete single <file> from specified <folder>
    '''
    p = request.args.get('path')
    f = request.args.get('file')
    try:
      file = os.path.join(p,f)
      cmd = "rm -f {}".format(file).split()
      exit_code = subprocess.check_call(cmd)
      return json.dumps("ok"), 200
    except subprocess.CalledProcessError:
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
@app.route('/files/list', methods=['GET'])
def list_files():
    p = request.args.get('path')
    files_list = [] 
    
    try:
        for f in os.listdir(p):
            if os.path.isfile(p + '/' + f):
              files_list.append(f)
        return json.dumps(files_list), 200    
    except:
     return "Unable to find the files", 404 

'''
    Retrieve files from specified folder
    Note that base path is set to DIR_PATH
'''
@app.route('/files/content', methods=['GET'])
def get_files():
    p = request.args.get('path')
    ret = []
    try:
        for f in os.listdir(p):
            print f
            with open(p + '/' + f, 'r') as file_content:
                ret.append({'filename': f, 'content': file_content.read()})
        return json.dumps(ret), 200
    except:
        return "Unable to find the files", 404
'''
  Retrieve the tree in JSON format given the parent folder path.
'''
@app.route('/tree', methods=['GET'])
def get_dir_tree():
  parent_path = TREE_DIR_PATH
  hierarchy = path_hierarchy(parent_path)
  return json.dumps(hierarchy), 200

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
