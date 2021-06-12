import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MowComponent } from './mow/mow.component';
import { LameloComponent } from './lamelo/lamelo.component';
import { BhoysComponent } from './bhoys/bhoys.component';
import { SigComponent } from './sig/sig.component';

const routes: Routes = [
  { path: 'mow', component: MowComponent},
  { path: 'lamelo', component: LameloComponent},
  { path: 'bhoys', component: BhoysComponent},
  { path: 'sig', component: SigComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
