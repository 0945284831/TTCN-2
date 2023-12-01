import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GioithieuComponent } from './gioithieu/gioithieu.component';
import { LienheComponent } from './lienhe/lienhe.component';




@NgModule({
  declarations: [
    UserComponent,
    GioithieuComponent,
    LienheComponent,  
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MenubarModule,
    DropdownModule,
    FormsModule,
    NgbCollapseModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule
  ]
})
export class UserModule { }
