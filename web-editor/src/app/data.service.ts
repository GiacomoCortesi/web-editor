import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }
  //backend = "http://" + window.location.host + ":5000" 
  backend = "http://10.150.4.226:5000" 

  getFile(file: string) {
    let params = new HttpParams().set('file', file);

    return this.http.get(this.backend + '/file', {responseType: 'text', params: params})
  }

  getMtime(file: string) {
    let params = new HttpParams().set('file', file);
    
    return this.http.get(this.backend + '/file/mtime', {responseType: 'text', params: params})
  }

  saveFile(file:string, text: string) {
    const options = {headers: {'Content-Type': 'application/json'}};
    let data = {'text': text, 'file': file}
    
    return this.http.post(this.backend + '/file', JSON.stringify(data), options)
  }
  
  deleteFile(file: string) {
    let params = new HttpParams().set('file', file);

    return this.http.delete(this.backend + '/file', {params: params})
  }

  getTree() {
    return this.http.get(this.backend + '/tree')
  }

  listFiles(path: string) {
    let params = new HttpParams().set('path', path);
    return this.http.get(this.backend + '/files/list', {params: params})
  }

  getCSPath() {
    return this.http.get(this.backend + '/path/cheatsheets')
  }

  getScriptsPath() {
    return this.http.get(this.backend + '/path/scripts')
  }
  
  getFiles(path: string) {
    let params = new HttpParams().set('path', path);
    return this.http.get(this.backend + '/files/content', {params: params})
  }
}
