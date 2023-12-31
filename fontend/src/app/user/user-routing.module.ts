import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { BrowserModule } from '@angular/platform-browser';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { LienheComponent } from './lienhe/lienhe.component';

import { HomeComponent } from './home/home.component';
import { CuahangComponent } from './cuahang/cuahang.component';
import { DangkyComponent } from './dangky/dangky.component';
import { DangnhapComponent } from './dangnhap/dangnhap.component';
import { SanphamComponent } from './sanpham/sanpham.component';
import { TaikhoanComponent } from './taikhoan/taikhoan.component';
import { ChitietsanphamComponent } from './chitietsanpham/chitietsanpham.component';
import { TintucComponent } from './tintuc/tintuc.component'
import { NewDetailComponent } from './tintuc/new-detail/new-detail.component'; 
import { ChitietdonhangComponent } from './chitietdonhang/chitietdonhang.component';
import { ThanhtoanComponent } from './thanhtoan/thanhtoan.component';
import { HoanthanhComponent } from './hoanthanh/hoanthanh.component';


const userRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'gioithieu', component: GioithieuComponent },
      { path: 'lienhe', component: LienheComponent },
      { path: 'cuahang', component: CuahangComponent },
      { path: 'sanpham', component: SanphamComponent,
      children: [
        { path: ':subCategoryId', component: SanphamComponent },
        { path: ':productId', component: ChitietsanphamComponent }
      ]},
      { path: 'dangnhap', component: DangnhapComponent },
      { path: 'dangky', component: DangkyComponent },
      { path: 'taikhoan', component: TaikhoanComponent },
      { path: 'tintuc', component: TintucComponent },
      { path: 'tintuc/:id', component: NewDetailComponent },
      { path: 'chitietsanpham/:id', component: ChitietsanphamComponent },
      { path: 'chitietdonhang', component: ChitietdonhangComponent },
      { path: 'thanhtoan', component: ThanhtoanComponent },
      { path: 'hoanthanh', component: HoanthanhComponent },

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
