import { Component, OnInit  } from '@angular/core';
import { SubCategoryService, SubCategory } from '../../../assets/service/sub-category.service'

@Component({
  selector: 'app-lienhe',
  templateUrl: './lienhe.component.html',
  styleUrls: ['./lienhe.component.css']
})
export class LienheComponent implements OnInit {

  subCategories: SubCategory[] = [];

  constructor(private subCategoryService: SubCategoryService) {}

  ngOnInit(): void {
    this.loadSubCategories();
  }

  loadSubCategories(): void {
    this.subCategoryService.getSubCategories().subscribe(
      (subCategories) => {
        this.subCategories = subCategories;
      },
      (error) => {
        console.error('Lỗi khi lấy danh mục phụ:', error);
      }
    );
  }
}
