import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../assets/service/product.service';
import { SubCategoryService, SubCategory } from '../../../assets/service/sub-category.service';
import { MainCategoryService } from '../../../assets/service/main-category.service';
import { Subscription } from "rxjs";
import { Router} from '@angular/router';

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {
  subCategories = [
    { title: 'Tô-Chén-Dĩa', imageUrl: '../../../assets/img/danhmuc_1.png' },
    { title: 'Phụ kiện trà - cà phê', imageUrl: '../../../assets/img/danhmuc_2.png' },
    { title: 'Ly sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_3.png' },
    { title: 'Túi vải canvas', imageUrl: '../../../assets/img/danhmuc_4.png' },
    { title: 'Hộp sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_5.png' },
    { title: 'Bộ Trà', imageUrl: '../../../assets/img/danhmuc_6.png' },
  ];
  showAllProducts: boolean = true; // Mặc định hiển thị tất cả sản phẩm
  products: Product[] = [];
  selectedSortOrder: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  responsiveOptions: any[] | undefined;
  updatingProducts: boolean = false;
  noProducts: boolean = false;

  constructor(
    private productService: ProductService,
    private subCategoryService: SubCategoryService,
    private mainCategoryService: MainCategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.route.params.subscribe(params => {
      const mainCategoryId = params['mainCategoryId'];
      const subCategoryId = params['subCategoryId'];
      this.noProducts = false;
      // Đặt updatingProducts thành true khi bắt đầu cập nhật sản phẩm
      this.updatingProducts = true;
    
      if (mainCategoryId) {
        // Nếu có mainCategoryId, gọi service để lấy sản phẩm theo danh mục chính
        this.mainCategoryService.getProductsByMainCategory(mainCategoryId).subscribe(
          (products) => {
            this.products = products;
            console.log('Products by mainCategory:', products);
            this.sortProductsByPrice();
            // Đặt updatingProducts thành false khi đã cập nhật xong
            this.updatingProducts = false;
            // Kiểm tra nếu mảng products rỗng
            this.noProducts = this.products.length === 0;
          },
          (error) => {
            console.error('Error loading products by mainCategory:', error);
            // Đặt updatingProducts thành false nếu có lỗi
            this.updatingProducts = false;
            // Đặt noProducts thành true nếu có lỗi
            this.noProducts = true;
          }
        );
      } else if (subCategoryId) {
        // Nếu có subCategoryId, gọi service để lấy sản phẩm theo danh mục phụ
        this.subCategoryService.getProductsBySubCategory(subCategoryId).subscribe(
          (products) => {
            this.products = products;
            console.log('Products by subCategory:', products);
            this.sortProductsByPrice();
            // Đặt updatingProducts thành false khi đã cập nhật xong
            this.updatingProducts = false;
            // Kiểm tra nếu mảng products rỗng
            this.noProducts = this.products.length === 0;
          },
          (error) => {
            console.error('Error loading products by subCategory:', error);
            // Đặt updatingProducts thành false nếu có lỗi
            this.updatingProducts = false;
            // Đặt noProducts thành true nếu có lỗi
            this.noProducts = true;
          }
        );
      } else {
        // Nếu cả hai đều không có tham số, gọi service để lấy tất cả sản phẩm
        this.productService.getProducts().subscribe(
          (data: Product[]) => {
            this.products = data;
            console.log('All Products:', data);
            this.sortProductsByPrice();
            // Đặt updatingProducts thành false khi đã cập nhật xong
            this.updatingProducts = false;
            // Kiểm tra nếu mảng products rỗng
            this.noProducts = this.products.length === 0;
          },
          (error) => {
            console.error('Error fetching all products:', error);
            // Đặt updatingProducts thành false nếu có lỗi
            this.updatingProducts = false;
            // Đặt noProducts thành true nếu có lỗi
            this.noProducts = true;
          }
        );
      }
    });
    
  }

  // Hàm để load tất cả sản phẩm
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        console.log('All Products:', data);
        // Gọi hàm sắp xếp sản phẩm nếu cần
        this.sortProductsByPrice();
      },
      (error) => {
        console.error('Error fetching all products:', error);
      }
    );
  }

  redirectToProductsId(productId: string): void {
    this.router.navigate(['/user/sanpham', { productId }]);
  }

  sortProductsByPrice() {
    this.products.sort((a, b) => {
      const priceA = a.productPrice;
      const priceB = b.productPrice;
  
      if (this.sortOrder === 'asc') {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  }
  
  onSortOrderChange(order: string) {
    switch (order) {
      case 'priceAsc':
        this.sortOrder = 'asc';
        this.sortProductsByPrice();
        break;
      case 'priceDesc':
        this.sortOrder = 'desc';
        this.sortProductsByPrice();
        break;
      case 'nameAsc':
        this.sortOrder = 'asc';
        this.sortProductsByNameAsc();
        break;
      case 'nameDesc':
        this.sortOrder = 'desc';
        this.sortProductsByNameDesc();
        break;
      default:
        // Xử lý trường hợp khác nếu cần
        break;
    }
    this.selectedSortOrder = order;
  }
  
  sortProductsByNameAsc() {
    this.products.sort((a, b) => {
      const nameA = a.productName.toLowerCase();
      const nameB = b.productName.toLowerCase();
  
      return nameA.localeCompare(nameB);
    });
  }
  
  sortProductsByNameDesc() {
    this.products.sort((a, b) => {
      const nameA = a.productName.toLowerCase();
      const nameB = b.productName.toLowerCase();
  
      return nameB.localeCompare(nameA);
    });
  }
  
  
  
  
  
}
