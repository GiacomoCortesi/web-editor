import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ScriptsComponent } from './scripts/scripts.component';
import { TreeViewerComponent } from './tree-viewer/tree-viewer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'viewer', component: ViewerComponent},
  { path: 'scripts', component: ScriptsComponent},
  { path: 'tree-viewer', component: TreeViewerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
