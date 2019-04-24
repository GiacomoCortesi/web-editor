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
  private selected_mtime: string;

  ngOnInit() {
    this.showFiles('cheatsheets');
    this.getFile('cheatsheets', 'README.md');
  }

  showFiles(folder) {
    this.data.listFiles(folder).subscribe(
      data => {
      this.files = data;
      for(let f of this.files) {
        this.fileList.push(this.capitalFirstLetter(f.replace(/_/g, ' ').replace('.md', '')));
      }
      console.log(this.files)
      });
  }
  
  getFile(folder, filename) {
    this.data.getFile(folder, filename).subscribe(
      data => {
      this.html = converter.makeHtml(data);
      this.selected = filename.replace(/_/g, ' ').replace('.md', '').toUpperCase();
      this.selected_mtime = <string><unknown>this.getMtime(folder, filename);
      console.log(data);
      });
  }

  getMtime(folder, filename) {
    this.data.getMtime(folder, filename).subscribe(
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

  prettify (str) {
    return str.replace(/_/g, ' ').replace('.md', '').toUpperCase();
  }
}

