import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { LienheComponent } from './lienhe/lienhe.component';
import { CarouselModule } from 'primeng/carousel';
import { HomeComponent } from './home/home.component';
import { CuahangComponent } from './cuahang/cuahang.component';
import { SanphamComponent } from './sanpham/sanpham.component';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DangnhapComponent } from './dangnhap/dangnhap.component';
import { DangkyComponent } from './dangky/dangky.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaikhoanComponent } from './taikhoan/taikhoan.component';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ChitietsanphamComponent } from './chitietsanpham/chitietsanpham.component';

@NgModule({
  declarations: [
    UserComponent,
    GioithieuComponent,
    LienheComponent,
    HomeComponent,
    CuahangComponent,
    SanphamComponent,
    DangnhapComponent,
    DangkyComponent,
    TaikhoanComponent,
    ChitietsanphamComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    MenubarModule,
    DropdownModule,
    FormsModule,
    NgbCollapseModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    CarouselModule,
    DataViewModule,
    RatingModule,
    TagModule,
    ToastModule,
    PasswordModule,
    DialogModule,
    ButtonModule
  ]
})
export class UserModule { }
