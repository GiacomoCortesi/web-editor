import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  backend = "http://10.150.4.226:5000"

  getFiles(folder: string) {
    return this.http.get(this.backend + '/' + folder)
  }

  getFile(folder: string, filename: string) {
    return this.http.get(this.backend + '/' + folder + '/' + filename, {responseType: 'text'})
  }

  listFiles(folder) {
    return this.http.get(this.backend + '/list/' + folder)
  }
  
  getMtime(folder, filename) {
    return this.http.get(this.backend + '/' + folder + '/' + filename + '/mtime', {responseType: 'text'})
  }

}
