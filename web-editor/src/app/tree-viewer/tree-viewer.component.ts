import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DataService } from  '../data.service';

declare var require: any;
const showdown = require('showdown');
const converter = new showdown.Converter();

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.scss']
})
export class TreeViewerComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  private tree: Object;
  private path: string = "/root/xran-box/README.md"

  constructor(private data: DataService) {
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  ngOnInit() {
    this.getTree()
    this.getFile(this.path, 'README.md');
  }

  getTree() {
    this.data.getTree().subscribe(
      data => {
      this.tree = data;
      this.dataSource.data = this.tree;
      console.log(this.tree);
      });
  }

  getFile(folder, filename) {

    //Horrible trick to remove the filename from the path
    let to_remove = folder.replace(/.*\/(.*)/,'$1');
    folder = folder.replace(to_remove, '')
    this.data.getFile(folder, filename).subscribe(
      data => {
      // console.log(filename)
      this.html = converter.makeHtml(data);
      // this.selected = filename.replace(/_/g, ' ').replace('.md', '').toUpperCase();
      this.selected=filename
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

}
