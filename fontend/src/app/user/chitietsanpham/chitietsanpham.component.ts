import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../assets/service/product.service';

@Component({
  selector: 'app-chitietsanpham',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css']
})
export class ChitietsanphamComponent implements OnInit {
  product: Product | undefined;  // Initialize as undefined
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.getProductDetail(productId);
    });
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

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
