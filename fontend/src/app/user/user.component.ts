import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MainCategoryService, MainCategory } from '../../assets/service/main-category.service';
import { SubCategoryService, SubCategory } from '../../assets/service/sub-category.service';
import { AuthService } from '../../assets/service/auth.service';
import { ShoppingCart, ShoppingCartItem, ShoppingCartService } from '../../assets/service/giohang.service'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  mainCategories!: MainCategory[];
  selectedMainCategory!: MainCategory;
  subCategories: SubCategory[] = [];

  shoppingCart!: ShoppingCart;
  shoppingCartItem!:ShoppingCartItem
  isCartVisible = false;
  
  constructor(
    private router: Router,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}


  items: MenuItem[] = [];


  ngOnInit() {
    this.loadMainCategories();
  }

  isLoggedIn(): boolean {
    // Gọi phương thức từ AuthService để kiểm tra trạng thái đăng nhập
    return this.authService.getLoginStatus();
  }

  logout(): void {
    // Gọi phương thức đăng xuất từ AuthService
    this.authService.logout().subscribe(
      () => {
        // Thực hiện các hành động cần thiết sau khi đăng xuất
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  redirectToProductstomainCategoryId(mainCategoryId: string): void {
    this.router.navigate(['/user/sanpham', { mainCategoryId }]);
  }
  redirectToProductstosubCategoryId(subCategoryId: string): void {
    this.router.navigate(['/user/sanpham', { subCategoryId }]);
  }

  loadMainCategories() {
    this.mainCategoryService.getMainCategories().subscribe(
      (mainCategories) => {
        this.mainCategories = mainCategories;
        if (mainCategories.length > 0) {
          this.selectedMainCategory = mainCategories[0];
          this.loadSubCategories(this.selectedMainCategory.mainCategoryId);
        }
        this.items = this.mapCategoriesToMenu(mainCategories);
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
      }
    );
  }

  onMainCategorySelected(mainCategory: MainCategory) {
    this.selectedMainCategory = mainCategory;
    this.loadSubCategories(mainCategory.mainCategoryId);
  }

  mapCategoriesToMenu(categories: MainCategory[]): MenuItem[] {
    return categories.map(category => {
      return {
        label: category.mainCategoryName,
        command: () => this.onMainCategorySelected(category),
      };
    });
  }

  isMenuVisible: boolean = false;

  showMenu() {
    this.isMenuVisible = true;
  }

  hideMenu() {
    this.isMenuVisible = false;
  }
  public isCollapsed = true;


  showShoppingCart() {
    // Gọi service để lấy thông tin giỏ hàng
    this.shoppingCartService.getShoppingCartByUserId('userId').subscribe(
      (cart: ShoppingCart) => {
        this.shoppingCart = cart;
        this.isCartVisible = true; // Hiển thị giỏ hàng khi di chuột qua nút mua sắm
      },
      (error) => {
        console.error('Error loading shopping cart:', error);
      }
    );
  }

  
}
