
import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../assets/service/product.service'; 
import { AuthService } from '../../../assets/service/auth.service';
import { ShoppingCartService } from '../../../assets/service/giohang.service';
import { Galleria } from 'primeng/galleria';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css']
})
export class ChitietsanphamComponent implements OnInit {
  product!: Product;
  productImages: any[] = []; // Adjust the type based on your actual data structure
  quantity: number = 1; // Assuming you have a quantity property


  activeTab: 'productDescription' | 'purchaseGuide' = 'productDescription';

  showContent(tab: 'productDescription' | 'purchaseGuide'): void {
    this.activeTab = tab;
  }
  // Adjust the responsive options based on your needs
  responsiveOptions=[
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '375px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.getProductDetail(productId);
    });
   
    
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
          // Handle the case where essential data is missing
        }
      }
}
