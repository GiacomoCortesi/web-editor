import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  backend = "http://172.17.0.2:5000"

  getFile(filename: string) {
    return this.http.get(this.backend + '/' + filename, {responseType: 'text'})
  }
  
  listFiles() {
    return this.http.get(this.backend + '/list')
  }
  
  getMtime(filename) {
    return this.http.get(this.backend + '/' + filename + '/mtime', {responseType: 'text'})
  }

}
