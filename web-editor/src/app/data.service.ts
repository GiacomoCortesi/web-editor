import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }
  backend = "http://10.150.4.226:5000"

  getFiles(folder: string) {
    return this.http.get(this.backend + '/' + folder)
  }

  getFile(path: string, file: string) {
    let params = new HttpParams().set('path', path);
    params = params.append('file', file);

    return this.http.get(this.backend + '/file', {responseType: 'text', params: params})
  }

  getMtime(path: string, file: string) {
    let params = new HttpParams().set('path', path);
    params = params.append('file', file);
    
    return this.http.get(this.backend + '/file/mtime', {responseType: 'text', params: params})
  }

  getTree() {
    return this.http.get(this.backend + '/tree')
  }

  listFiles(folder) {
    return this.http.get(this.backend + '/list/' + folder)
  }
}
