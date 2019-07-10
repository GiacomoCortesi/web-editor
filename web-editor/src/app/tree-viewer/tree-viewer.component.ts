import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DataService } from  '../data.service';

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
  private path: string = "/root/xran-box/README.md"
  private selected: string;
  private selected_mtime: string;
  private text: string;
  private editMode: boolean = false;
  private html: string;

  constructor(private data: DataService) {
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  ngOnInit() {
    converter.setOption("tables", true)

    this.getTree()
    this.getFile(this.path, 'README.md');
  }

  getTree() {
    this.data.getTree().subscribe(
      data => {
      this.tree = data;
      this.dataSource.data = this.tree['children'];
      console.log(this.tree);
      });
  }

  getFile(folder, filename) {

    //Horrible trick to remove the filename from the path
    let to_remove = folder.replace(/.*\/(.*)/,'$1');
    folder = folder.replace(to_remove, '')
    this.data.getFile(folder, filename).subscribe(
      data => {
      this.text = data
      this.path = folder
      console.log(this.path)
      this.html = converter.makeHtml(data);
      // this.selected = filename.replace(/_/g, ' ').replace('.md', '').toUpperCase();
      this.selected=filename
      this.selected_mtime = <string><unknown>this.getMtime(folder, filename);
      console.log(data);
      this.editMode = false;
    });
  }

  getMtime(folder, filename) {
    this.data.getMtime(folder, filename).subscribe(
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
    file = this.path + this.selected
    this.data.saveFile(file, text).subscribe(
      data => {
        this.getFile(this.path, this.selected);
      }); 
    this.editMode = false;
  }

}
