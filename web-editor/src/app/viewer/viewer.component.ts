import { Component, OnInit } from '@angular/core';
import { DataService } from  '../data.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';


declare var require: any;
const showdown = require('showdown');
const converter = new showdown.Converter();


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  private path: string;
  private html
  private selected: String;
  private files;
  private filename: String;
  private text: string;
  private editMode: boolean = false;
  private selected_mtime: string;
  private rerender: boolean = false;
  private fileToCreate: string;

  constructor(private data: DataService, private createDialog: MatDialog, private deleteDialog: MatDialog) {
  }

  ngOnInit() {
    converter.setOption("tables", true)
    converter.setOption("emoji", true)
    
    this.data.getCSPath().subscribe(
      data => {
        this.path = data["cheatsheets_path"]
        this.showFiles(this.path);
        this.getFile(this.path + 'README.md');
      }
    )
  }

  showFiles(path) {
    this.data.listFiles(path).subscribe(
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
  
  getFile(f) {
    this.data.getFile(f).subscribe(
      data => {
      // console.log(filename)
      this.html = converter.makeHtml(data);
      this.text = data
      // this.selected = filename.replace(/_/g, ' ').replace('.md', '').toUpperCase();
      this.selected=f
      this.selected_mtime = <string><unknown>this.getMtime(f);
      console.log(data);
    });
    this.editMode = false;
  }
  

  getMtime(folder) {
    this.data.getMtime(folder).subscribe(
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
        this.showFiles(this.path)
        this.getFile(this.selected);
      }); 
    this.editMode = false;
  }

  openCreateDialog(): void {
    const createDialogRef = this.createDialog.open(DialogComponent, {
      width: '250px',
      data: {file: this.fileToCreate}
    });

    createDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("Received dialog data: "+ result)
      if (result) {
        this.selected = result;
        this.saveFile(this.path + '/' + result, "Brand new file")
      }
    });
  }

  openDeleteDialog(): void {
    const deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {file: this.selected}
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.showFiles(this.path)
      this.getFile(this.selected);
    });
  }

}

