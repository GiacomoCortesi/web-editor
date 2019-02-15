import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewerComponent } from './viewer/viewer.component';
import { EditorComponent } from './editor/editor.component';
import { ScriptsComponent } from './scripts/scripts.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'viewer', component: ViewerComponent},
  { path: 'editor', component: EditorComponent},
  { path: 'scripts', component: ScriptsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
