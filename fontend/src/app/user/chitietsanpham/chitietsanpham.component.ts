
import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../assets/service/product.service'; 
import { AuthService } from '../../../assets/service/auth.service';
import { ShoppingCartService } from '../../../assets/service/giohang.service';
import { Galleria } from 'primeng/galleria';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-details',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css']
})
export class ChitietsanphamComponent implements OnInit {
  product!: Product;
  isProductInStock: boolean = true;
  
  productImages: any[] = []; // Adjust the type based on your actual data structure
  quantity: number = 1; // Assuming you have a quantity property

  subCategories = [
    { title: 'Tô-Chén-Dĩa', imageUrl: '../../../assets/img/danhmuc_1.png' },
    { title: 'Phụ kiện trà - cà phê', imageUrl: '../../../assets/img/danhmuc_2.png' },
    { title: 'Ly sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_3.png' },
    { title: 'Túi vải canvas', imageUrl: '../../../assets/img/danhmuc_4.png' },
    { title: 'Hộp sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_5.png' },
    { title: 'Bộ Trà', imageUrl: '../../../assets/img/danhmuc_6.png' },
 ];
  responsiveOptions: any[] | undefined;


  activeTab: 'productDescription' | 'purchaseGuide' = 'productDescription';

  showContent(tab: 'productDescription' | 'purchaseGuide'): void {
    this.activeTab = tab;
  }
  // Adjust the responsive options based on your needs
  
 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private router: Router ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.getProductDetail(productId);
    });
   

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
    
  }

  loadImages(): void {
    if (this.product && this.product.productImage) {
      // Assuming your productImage array is an array of strings (image URLs)
      this.productImages = this.product.productImage.map(image => {
        return {
          itemImageSrc: 'http://localhost:3000' + image, // Full-size image
          thumbnailImageSrc: 'http://localhost:3000' + image // Thumbnail version of the image
        };
      });
    }
  }

  getProductDetail(productId: string): void {
        this.productService.getProductById(productId).subscribe(
          (data) => {
            this.product = data;
            if (this.product && this.product.productQuantity <= 0) {
              this.isProductInStock = false;
            }
          },
          (error) => {
            console.error('Error fetching product detail:', error);
          }
        );
      }

      addToCart(): void {
        const productId = this.product._id;
        const quantity = this.quantity;
        const userId = this.authService.getUserId();
        this.shoppingCartService.updateTotalQuantity();
    
        if (productId && quantity && userId) {
            this.shoppingCartService.addToCart(userId, productId, quantity).subscribe(
                (shoppingCart) => {
                    console.log('Product added to the shopping cart:', shoppingCart);
                    // You can perform additional actions if needed
                },
                (error) => {
                    console.error('Error adding product to the shopping cart:', error);
                    // Handle error as needed
                }
            );
        } else {
            console.warn('Product ID, quantity, or user ID is missing. Unable to add to cart.');
            // If userId is missing, navigate to the login page
            this.router.navigate(['/user/dangnhap']);
        }
}

      confirm1(event: Event) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'thêm sản phẩm này vào giỏ hàng?',
          header: 'Thêm sản phẩm vào giỏ hàng',
          icon: 'pi pi-shopping-bag',
          acceptIcon: 'none',
          rejectIcon: 'none',
          rejectButtonStyleClass: 'p-button-text',
          accept: () => {
            this.addToCart();
          },
          reject: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
              life: 3000
            });
          }
        });
      }
}
