
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

export interface Product {
  productName: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  mainCategoryId: string;
  subCategoryId: string;
  productImage : string[];
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private products$ = new Subject<Product[]>();
  readonly url = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  addProduct(productData: FormData): void {
    this.http.post<{ product: Product }>(this.url, productData)
      .subscribe(
        (response) => {
          // Handle the response as needed
          console.log('Product added successfully:', response.product);
        },
        (error) => {
          console.error('Error adding product:', error);
          // Handle the error, show a message, etc.
        }
      );
  }
  
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getProductById(productId: string): Observable<Product> {
    const productUrl = `${this.url}/${productId}`;
    return this.http.get<Product>(productUrl);
  }
}


