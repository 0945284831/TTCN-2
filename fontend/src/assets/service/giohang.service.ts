import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Product } from './product.service';

export interface ShoppingCart {
  user: string;
  items: ShoppingCartItem[];
  totalAmount: number;
}

export interface ShoppingCartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private totalQuantity$ = new BehaviorSubject<number>(0);
  private shoppingCart: ShoppingCart = { user: '', items: [], totalAmount: 0 };
  private shoppingCart$ = new BehaviorSubject<ShoppingCart>({ user: '', items: [], totalAmount: 0 });

  readonly url = 'http://localhost:3000/api/giohang';

  constructor(private http: HttpClient) {}

  addToCart(userId: string, productId: string, quantity: number): Observable<ShoppingCart> {
    const addToCartUrl = `${this.url}/add-to-cart`;
    const data = { userId, productId, quantity };

    return this.http.post<ShoppingCart>(addToCartUrl, data).pipe(
      tap((response) => {
        this.shoppingCart = response;
        this.shoppingCart$.next(this.shoppingCart);
      })
    );
  }

  removeFromCart(userId: string, productId: string, quantity: number): Observable<ShoppingCart> {
    const removeFromCartUrl = `${this.url}/remove-from-cart`;
    const data = { userId, productId, quantity };

    return this.http.post<ShoppingCart>(removeFromCartUrl, data).pipe(
      tap((response) => {
        this.shoppingCart = response;
        this.shoppingCart$.next(this.shoppingCart);
      })
    );
  }

  getShoppingCart(): Observable<ShoppingCart> {
    return this.shoppingCart$.asObservable();
  }

  getShoppingCartByUserId(userId: string): Observable<ShoppingCart> {
    const getCartUrl = `${this.url}/get-cart/${userId}`;

    return this.http.get<any>(getCartUrl).pipe(
      map((response) => ({
        user: response.shoppingCart.user,
        items: response.shoppingCart.items,
        totalAmount: response.shoppingCart.totalAmount
      })),
      tap((mappedResponse) => {
        this.shoppingCart = mappedResponse;
        this.shoppingCart$.next(this.shoppingCart);
      })
    );
  }
  
  get totalQuantity(): number {
    return this.shoppingCart.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateTotalQuantity(): void {
    const totalQuantity = this.shoppingCart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    this.totalQuantity$.next(totalQuantity);
  }
}
