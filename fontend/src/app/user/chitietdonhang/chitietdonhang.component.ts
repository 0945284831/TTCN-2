import { Component, OnInit } from '@angular/core';
import { ShoppingCart, ShoppingCartItem, ShoppingCartService } from '../../../assets/service/giohang.service'
import { OrderService } from '../../../assets/service/donhang.service';
import { AuthService } from '../../../assets/service/auth.service';
import { Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-chitietdonhang',
  templateUrl: './chitietdonhang.component.html',
  styleUrls: ['./chitietdonhang.component.css']
})
export class ChitietdonhangComponent implements OnInit{

  shoppingCart!: ShoppingCart ;
  shoppingCartItem!:ShoppingCartItem
  
  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,

  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();

    if (userId) {
      // Lấy thông tin giỏ hàng khi component được khởi tạo
      this.shoppingCartService.getShoppingCartByUserId(userId).subscribe(
        (cart) => {
          this.shoppingCart = cart;
        },
        (error) => {
          console.error('Error loading shopping cart:', error);
        }
      );
    }
  }
    
  }

