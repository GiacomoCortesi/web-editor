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
  private path: string = '/root/mix_scripts/cheatsheets'
  private html
  private selected: String;
  private files;
  private filename: String;
  private text: string;
  private editMode: bool = false;
  private selected_mtime: string;
  private rerender: bool = false;

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.showFiles('cheatsheets');
    this.getFile(this.path, 'README.md');
  }

  showFiles(folder) {
    this.data.listFiles(folder).subscribe(
      data => {
      this.files = data;
      // Skip files starting with '.'
      for(let f of this.files) {
        if (f[0] == '.') {
          let index = this.files.indexOf(f)
          if(index > -1) {
            this.files.splice(index, 1)
          }
        }
      }
      console.log(this.files)
      });
  }
  
  getFile(folder, filename) {
    this.data.getFile(folder, filename).subscribe(
      data => {
      // console.log(filename)
      this.html = converter.makeHtml(data);
      this.text = data
      // this.selected = filename.replace(/_/g, ' ').replace('.md', '').toUpperCase();
      this.selected=filename
      this.selected_mtime = <string><unknown>this.getMtime(folder, filename);
      console.log(data);
    });
    this.editMode = false;
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

  enableEditMode() {
    this.editMode = true;
  }

  saveFile(file, text) {
    this.data.saveFile(file, text).subscribe(
      data => {
        this.getFile(this.path, this.selected);
      }); 
    this.editMode = false;
  }

}

