import { Component } from '@angular/core';

declare var require: any;
//const showdown = require('showdown');

//const converter = new showdown.Converter();
//var text = '#hello, markdown!';


@Component({
  selector: 'app-root',
  // You can either specify html by url
  templateUrl: './app.component.html',
  // or internally, but you cannot use both
  //template: '<div [innerHtml]="html"></div>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-editor';
  //html = converter.makeHtml(text);
}

