import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  private fileText;
  username = '';
  user_empty = true;
  constructor() { }
  isUsernameEmpty() {
    if (this.username) {
      return false;
    }
    return true;
  }
  
  resetUsername() {
    this.username=''
  }

  ngOnInit() {
  }


  fileUpload(event) {
    var reader = new FileReader();
    reader.readAsText(event.srcElement.files[0]);
    var me = this;
    reader.onload = function () {
      me.fileText = reader.result;
    }
  }


}
