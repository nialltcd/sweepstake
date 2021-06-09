import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MowComponent } from './mow/mow.component';
import { LameloComponent } from './lamelo/lamelo.component';
import { BhoysComponent } from './bhoys/bhoys.component';

const routes: Routes = [
  { path: 'mow', component: MowComponent},
  { path: 'lamelo', component: LameloComponent},
  { path: 'bhoys', component: BhoysComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
