// main-category.component.ts
import { Component, OnInit } from '@angular/core';
import { MainCategory, MainCategoryService } from '../../../assets/service/main-category.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.css']
})
export class MainCategoryComponent implements OnInit {
  mainCategories: MainCategory[] = [];
  newMainCategoryName: string = ''; // Add this line to fix the error

  constructor(
    private mainCategoryService: MainCategoryService,
    private confirmationService: ConfirmationService,
    ) {}

  ngOnInit(): void {
    this.loadMainCategories();
  }

  loadMainCategories() {
    this.mainCategoryService.getMainCategories().subscribe((data) => {
      this.mainCategories = data;
    });
  }

  addMainCategory() {
    this.mainCategoryService.addMainCategory(this.newMainCategoryName).subscribe(() => {
      this.loadMainCategories();
      this.newMainCategoryName = '';
    });
  }

  updateMainCategory(mainCategory: MainCategory) {
    this.mainCategoryService.updateMainCategory(mainCategory.mainCategoryId, this.newMainCategoryName).subscribe(() => {
      this.loadMainCategories();
    });
  }

  confirmDelete(mainCategoryId: string) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa danh mục này không?',
      accept: () => {
        // Call your delete method here
        this.deleteMainCategory(mainCategoryId);
      }
    });
  }
  deleteMainCategory(mainCategoryId: string) {
    this.mainCategoryService.deleteMainCategory(mainCategoryId).subscribe(
      () => {
        this.loadMainCategories();
      },
      (error) => {
        console.error('Error deleting main category:', error);
        // Add logic to handle and display the error to the user
      }
    );
  }
  
}
