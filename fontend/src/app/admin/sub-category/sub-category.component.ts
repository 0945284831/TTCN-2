import { Component, OnInit } from '@angular/core';
import { SubCategoryService, SubCategory } from './sub-category.service';
import { MainCategoryService, MainCategory } from '../main-category/main-category.service';
import { ConfirmationService } from 'primeng/api';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css'],
})
export class SubCategoryComponent implements OnInit {
  subCategoryName: string = '';
  mainCategoryId: string = '';
  mainCategories: MainCategory[] = [];
  subCategories: SubCategory[] = [];
  selectedSubCategory: any;
  mainCategoryFilter: any; // assuming mainCategoryId is of type any
  originalSubCategories: any[] = [];; // store the original data
  subCategoryForm!: FormGroup;
  constructor(
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.subCategoryForm = this.formBuilder.group({
      subCategoryName: ['', Validators.required],
      mainCategoryId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getMainCategories();
    this.getSubCategories();
    this.fetchOriginalSubCategories();
  }

  getMainCategoryNames(mainCategoryIds: string[]): Observable<string[]> {
    return forkJoin(
      mainCategoryIds.map(mainCategoryId =>
        this.subCategoryService.getMainCategoryName(mainCategoryId)
      )
    );
  }
  
  fetchOriginalSubCategories() {
    this.subCategoryService.getSubCategories().subscribe(
      (subCategories) => {
        const mainCategoryIds = subCategories.map(subCategory => subCategory.mainCategoryId);

        this.getMainCategoryNames(mainCategoryIds).subscribe(
          (mainCategoryNames: string[]) => {
            this.originalSubCategories = subCategories.map((subCategory, index) => {
              subCategory.mainCategoryName = mainCategoryNames[index];
              return subCategory;
            });

            this.subCategories = [...this.originalSubCategories];
            console.log('Original Subcategories:', this.originalSubCategories);
          },
          (error) => {
            console.error('Error fetching main category names:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching original subcategories:', error);
      }
    );
  }

  getMainCategories(): void {
    this.mainCategoryService.getMainCategories().subscribe(
      (mainCategories) => {
        this.mainCategories = mainCategories;
      },
      (error) => {
        console.error('Error fetching main categories:', error);
      }
    );
  }

  getSubCategories(): void {
    this.subCategoryService.getSubCategories().subscribe(
      (subCategories) => {
        // Assign mainCategoryName to each subcategory based on mainCategoryId
        subCategories.forEach((subCategory) => {
          this.subCategoryService.getMainCategoryName(subCategory.mainCategoryId).subscribe(
            (mainCategoryName) => {
              subCategory.mainCategoryName = mainCategoryName;
            },
            (error) => {
              console.error('Error fetching main category name:', error);
            }
          );
        });

        this.subCategories = subCategories;
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  }

  addSubCategory(): void {
    if (!this.subCategoryName || !this.mainCategoryId) {
      // Handle validation or show an error message
      return;
    }

    this.subCategoryService.addSubCategory(this.subCategoryName, this.mainCategoryId).subscribe(
      (newSubCategory) => {
        // Successfully added, you might want to refresh the subcategories list
        this.getSubCategories();

        // Reset the input values
        this.subCategoryName = '';
        this.mainCategoryId = '';
      },
      (error) => {
        // Handle error, you can show an error message to the user
      }
    );
  }

  applyMainCategoryFilter() {
    // Kiểm tra xem dữ liệu gốc có sẵn không
    if (this.originalSubCategories) {
      // Nếu có chọn danh mục chính hoặc là chọn "Tất cả danh mục"
      if (this.mainCategoryFilter || this.mainCategoryFilter === '') {
        // Lọc một bản sao của dữ liệu gốc dựa trên danh mục chính được chọn
        const filteredSubCategories = this.originalSubCategories.filter(subCategory =>
          this.mainCategoryFilter ? subCategory.mainCategoryId === this.mainCategoryFilter : true
        );

        // Lấy tên danh mục chính cho từng danh mục phụ được lọc
        const mainCategoryIds = filteredSubCategories.map(subCategory => subCategory.mainCategoryId);

        this.getMainCategoryNames(mainCategoryIds).subscribe(
          (mainCategoryNames: string[]) => {
            // Gán tên danh mục chính cho từng danh mục phụ được lọc dựa trên mainCategoryId
            filteredSubCategories.forEach((subCategory, index) => {
              subCategory.mainCategoryName = mainCategoryNames[index];
            });

            // Cập nhật mảng subCategories
            this.subCategories = [...filteredSubCategories];
          },
          (error) => {
            console.error('Error fetching main category names:', error);
          }
        );
      } else {
        // Nếu không có danh mục chính nào được chọn, hiển thị tất cả dữ liệu gốc
        this.subCategories = [...this.originalSubCategories];
      }
    }
  }

  confirmDelete(subCategoryId: string): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa danh mục này không?',
      accept: () => {
        // Call your delete method here
        this.deleteSubCategory(subCategoryId);
      },
    });
  }

  deleteSubCategory(subCategoryId: string): void {
    this.subCategoryService.deleteSubCategory(subCategoryId).subscribe(
      () => {
        // Handle success, e.g., refresh the subcategory list
        this.getSubCategories();
      },
      (error) => {
        console.error('Error deleting subcategory:', error);
        // Handle error, show an alert, etc.
      }
    );
  }
}
