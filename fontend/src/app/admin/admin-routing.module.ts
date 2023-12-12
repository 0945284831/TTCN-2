import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';
import { MainCategoryComponent } from './main-category/main-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddProductComponent } from './product/product-add/add-product.component';
import {ProductListComponent} from'./product/product-list/product-list.component';
import {TintucComponent} from'./tintuc/tintuc.component';
import {TintucAddComponent} from'./tintuc/tintuc-add/tintuc-add/tintuc-add.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'main-category', component: MainCategoryComponent },
      { path: 'sub-category', component: SubCategoryComponent },
      { path: 'products', component: ProductListComponent, },
      { path: 'products/add', component: AddProductComponent, },
      { path: 'tintuc', component: TintucComponent, },
      { path: 'tintuc/add-news', component: TintucAddComponent },
    ]
  }
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forChild(adminRoutes),
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

