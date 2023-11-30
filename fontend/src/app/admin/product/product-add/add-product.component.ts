import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../product.service';
import { MainCategoryService, MainCategory } from '../../main-category/main-category.service';
import { SubCategoryService, SubCategory } from '../../sub-category/sub-category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productData: Product = {
    productName: '',
    productDescription: '',
    productPrice: 0,
    productQuantity: 0,
    mainCategoryId: '',
    subCategoryId: '',
    productImage: [],
  };
  product!: Product;
  form!: FormGroup;
  imageDataList: string[] = [];
  mainCategories: MainCategory[] = [];
  subCategories: SubCategory[] = [];
  uploadedFiles: any[] = [];

  constructor(
    private productService: ProductService,
    private mainCategoryService: MainCategoryService,
    private messageService: MessageService,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const defaultSubcategoryId = 'chọn danh mục phụ';
    // Load main categories initially
    this.loadMainCategories();
    this.form = this.formBuilder.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      productPrice: [null, [Validators.required, Validators.min(0)]],
      productQuantity: [null, [Validators.required, Validators.min(0)]],
      mainCategoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      productImage: [null, Validators.required],
    });
    this.form.get('subCategoryId')?.valueChanges.subscribe((value) => {
      this.productData.subCategoryId = value;
    });
  }

  loadMainCategories() {
    this.mainCategoryService.getMainCategories().subscribe(
      (mainCategories) => {
        this.mainCategories = mainCategories;
        // Optionally, you can select the first main category by default
        if (mainCategories.length > 0) {
          this.productData.mainCategoryId = mainCategories[0].mainCategoryId;
          this.loadSubCategories(this.productData.mainCategoryId);
        }
      },
      (error) => {
        console.error('Error loading main categories:', error);
      }
    );
  }

  loadSubCategories(mainCategoryId: string) {
    this.mainCategoryService.getSubCategoriesByMainCategory(mainCategoryId).subscribe(
      (subCategories: SubCategory[]) => {
        this.subCategories = subCategories;
      },
      (error) => {
        console.error('Error loading sub categories:', error);
        // Handle errors, e.g., display a user-friendly error message
      }
    );
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.clearImages();

    if (target && target.files && target.files.length > 0) {
      const files = target.files;
      this.uploadedFiles = [];
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (allowedMimeTypes.includes(file.type)) {
          const reader = new FileReader();

          reader.onload = () => {
            // Add image URL to the array
            this.imageDataList.push(reader.result as string);
          };

          reader.readAsDataURL(file);
        } else {
          // Handle invalid file types (if needed)
          console.error('Invalid file type:', file.type);
        }
      }

      // Update the form control to store the array of files
      this.form.patchValue({ productImage: files });
      
    }

  }

  async onSubmit() {
    const productImages: File[] = this.form.value.productImage;
    this.clearImages();
  
    if (productImages && productImages.length > 0) {
      // Combine all images into one FormData object
      const productData = new FormData();
  
      // Add other product data fields
      productData.append('productName', this.form.value.productName);
      productData.append('productDescription', this.form.value.productDescription);
      productData.append('productPrice', this.form.value.productPrice);
      productData.append('productQuantity', this.form.value.productQuantity);
      productData.append('mainCategoryId', this.form.value.mainCategoryId);
      productData.append('subCategoryId', this.form.value.subCategoryId);
  
      // Append all images to the FormData object
      for (let i = 0; i < productImages.length; i++) {
        productData.append('productImage', productImages[i]);
      }
  
      try {
        // Make a single request to add the product with all images
        await this.productService.addProduct(productData);
        // Navigate to the product list page (/admin/products) after successful addition
        this.router.navigate(['/admin/products']);
      } catch (error) {
        console.error('Error adding product:', error);
        // Handle errors, e.g., display a user-friendly error message
      }
    } else {
      console.error('No image file selected.');
    }
  
    this.form.reset();
  }
  

  clearImages() {
    this.imageDataList = [];
    // Optionally, you can also clear the form control value
    this.location.go(this.location.path());
  }
  

  onMainCategoryChange() {
    const mainCategoryId = this.form.value.mainCategoryId;
    if (mainCategoryId !== null && mainCategoryId !== undefined) {
      this.loadSubCategories(mainCategoryId);
    }
  }
  
  
}
