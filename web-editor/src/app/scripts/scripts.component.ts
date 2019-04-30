import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit {

  constructor(private data: DataService) { }
  private files;
  private filesContent: Object;
  private html;
  ngOnInit() {
    this.showFiles('scripts');
    this.getFiles('scripts')
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
      console.log(data)
      });
  }

  getFiles(folder) {
    this.data.getFiles(folder).subscribe(
      data => {
      this.filesContent = data;
      console.log(typeof(this.filesContent))
      //this.selected = this.capitalFirstLetter(filename.replace('_', ' ').replace('.md', ''));
      //this.selected_mtime = this.getMtime(filename)
      console.log(data)
      });
  }
}
