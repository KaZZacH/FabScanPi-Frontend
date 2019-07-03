import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FabscanComponent } from './components/fabscan.component';

const routes: Routes = [
  { path: '', component: FabscanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class FabscanRoutingModule { }
