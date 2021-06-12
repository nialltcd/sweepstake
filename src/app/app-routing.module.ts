import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MowComponent } from './mow/mow.component';
import { LameloComponent } from './lamelo/lamelo.component';
import { BhoysComponent } from './bhoys/bhoys.component';
import { SigComponent } from './sig/sig.component';
import { DolanComponent } from './dolan/dolan.component';

const routes: Routes = [
  { path: 'mow', component: MowComponent},
  { path: 'lamelo', component: LameloComponent},
  { path: 'bhoys', component: BhoysComponent},
  { path: 'sig', component: SigComponent},
  { path: 'dolan', component: DolanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
