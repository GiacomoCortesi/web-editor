import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DataService } from  '../data.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// TODO: Add service for file handling, to be used both by viewer and tree-viewer components
// NOTE: This will require some refactoring  

declare var require: any;
const showdown = require('showdown');
const converter = new showdown.Converter();

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.scss']
})
export class TreeViewerComponent implements OnInit {

  //TODO: Replace 'any' with actual data type
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  private tree: Object;
  private selected: string;
  private selected_mtime: string;
  private text: string;
  private editMode: boolean = false;
  private html: string;

  constructor(private data: DataService, private deleteDialog: MatDialog) {
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  ngOnInit() {
    converter.setOption("tables", true)
    converter.setOption("emoji", true)

    this.getTree()

  }

  getTree() {
    this.data.getTree().subscribe(
      data => {
      this.tree = data;
      this.getFile(this.tree['children'][1]['path']);
      this.dataSource.data = this.tree['children'];
      console.log(this.tree);
      });
  }

  getFile(f) {
    this.data.getFile(f).subscribe(
      data => {
      this.text = data
      console.log(f)
      this.html = converter.makeHtml(data);

      this.selected=f
      this.selected_mtime = <string><unknown>this.getMtime(f);
      this.editMode = false;
    });
  }

  getMtime(f) {
    this.data.getMtime(f).subscribe(
      data => {
      this.selected_mtime = data;
      console.log(data)
      }); 
  }

  prettify (str) {
    return str.replace(/_/g, ' ').replace('.md', '').toUpperCase();
  }

  enableEditMode() {
    this.editMode = true;
  }

  saveFile(file, text) {
    console.log(file)
    file = this.selected
    this.data.saveFile(file, text).subscribe(
      data => {
        this.getFile(this.selected);
      }); 
    this.editMode = false;
  }

  openDeleteDialog(): void {
    console.log("File to be deleted: " + this.selected)
    const deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {file: this.selected}
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getTree()
    });
  }

}
