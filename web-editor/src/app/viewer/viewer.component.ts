import { Component, OnInit } from '@angular/core';
import { DataService } from  '../data.service';

declare var require: any;
const showdown = require('showdown');
const converter = new showdown.Converter();


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

  private html
  private selected: String;
  private files;
  private fileList: Array<String> = [];
  private filename: String; 
  constructor(private data: DataService) {

 }
  private selected_mtime: String;

  ngOnInit() {
    this.showFiles();
    this.getFile('README.md');
  }

  showFiles() {
    this.data.listFiles().subscribe(
      data => {
      this.files = data;
      for(let f of data) {
        this.fileList.push(this.capitalFirstLetter(f.replace('_', ' ').replace('.md', '')));
      }
      console.log(data)
      });
  }
  
  getFile(filename) {
    this.data.getFile(filename).subscribe(
      data => {
      this.html = converter.makeHtml(data) 
      this.selected = this.capitalFirstLetter(filename.replace('_', ' ').replace('.md', ''));
      this.selected_mtime = this.getMtime(filename)
      console.log(data)
      });
  }

  getMtime(filename) {
    this.data.getMtime(filename).subscribe(
      data => {
      this.selected_mtime = data;
      console.log(data)
      }); 
  }

  capitalFirstLetter(str) 
  {
      str = str.split(" ");
  
      for (var i = 0, x = str.length; i < x; i++) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }
  
      return str.join(" ");
  }
}

