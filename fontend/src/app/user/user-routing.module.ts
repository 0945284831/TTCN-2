import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { BrowserModule } from '@angular/platform-browser'
import { GioithieuComponent } from './gioithieu/gioithieu.component'
import { LienheComponent } from './lienhe/lienhe.component'
const userRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'gioithieu', component: GioithieuComponent },
      { path: 'lienhe', component: LienheComponent },
    ]
  }
];
@NgModule({
  
  imports: [
    BrowserModule,
    RouterModule.forChild(userRoutes),
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
