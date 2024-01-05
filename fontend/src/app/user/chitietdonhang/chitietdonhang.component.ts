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

  subCategories = [
    { title: 'Tô-Chén-Dĩa', imageUrl: '../../../assets/img/danhmuc_1.png' },
    { title: 'Phụ kiện trà - cà phê', imageUrl: '../../../assets/img/danhmuc_2.png' },
    { title: 'Ly sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_3.png' },
    { title: 'Túi vải canvas', imageUrl: '../../../assets/img/danhmuc_4.png' },
    { title: 'Hộp sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_5.png' },
    { title: 'Bộ Trà', imageUrl: '../../../assets/img/danhmuc_6.png' },
 ];
  responsiveOptions: any[] | undefined;
  
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
    
  }

