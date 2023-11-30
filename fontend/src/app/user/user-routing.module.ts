import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      // { path: 'main-category', component: MainCategoryComponent },
      // { path: 'sub-category', component: SubCategoryComponent },
      // { path: 'products', component: ProductComponent }
    ]
  }
];
@NgModule({
  
  imports: [
    RouterModule.forChild(userRoutes),
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
