import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { BrowserModule } from '@angular/platform-browser';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { LienheComponent } from './lienhe/lienhe.component';
import { HomeComponent } from './home/home.component'
import { CuahangComponent } from './cuahang/cuahang.component'
import { SanphamComponent } from './sanpham/sanpham.component'

const userRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'gioithieu', component: GioithieuComponent },
      { path: 'lienhe', component: LienheComponent },
      { path: 'cuahang', component: CuahangComponent },
      { path: 'sanpham', component: SanphamComponent },

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
