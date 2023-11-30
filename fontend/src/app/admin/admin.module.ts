import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component'
import { AdminRoutingModule } from './admin-routing.module'; 
import { SidebarModule } from 'primeng/sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { HttpClientModule } from '@angular/common/http';
import { MainCategoryComponent } from './main-category/main-category.component';
import { AddProductComponent } from './product/product-add/add-product.component';
import { FormsModule } from '@angular/forms'; 
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {SubCategoryComponent} from './sub-category/sub-category.component'
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { ProductListComponent } from './product/product-list/product-list.component';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    AdminComponent,
    MainCategoryComponent,
    SubCategoryComponent,
    AddProductComponent,
    ProductListComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SidebarModule,
    BrowserAnimationsModule,
    MenubarModule,
    ButtonModule,
    CascadeSelectModule,
    HttpClientModule,
    CardModule,
    FormsModule,
    InputTextModule,
    TableModule,
    ConfirmDialogModule,
    DropdownModule,
    FileUploadModule,
    ReactiveFormsModule,
    BrowserModule,
    ImageModule,
    DataViewModule,
    RatingModule,
    TagModule,
    DialogModule,
  ],
  providers: [ConfirmationService,MessageService],
})
export class AdminModule { }
