// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


export interface Order {
  _id: string;
  user: string;
  items: any[]; // Bạn có thể định nghĩa kiểu cho mảng items tùy vào cấu trúc thực tế
  status: string;
  shippingAddress: any[]; // Định nghĩa kiểu cho shippingAddress tùy vào cấu trúc thực tế
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  __v: number;
}
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  zipCode: string;
  isDefault: boolean;
  _id: string;
}

export interface OrderResponse {
  success: boolean;
  orders: Order[];
}

export interface OrderItem {
  product: string;
  quantity: number;
  _id: string;
  productName?: string;  // Thêm thông tin productName (có thể có hoặc không)
  productImage?: string; // Thêm thông tin productImage (có thể có hoặc không)
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/api/donhang'; 
  constructor(private http: HttpClient) {}

  createOrder(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order`, { userId });
  }

  cancelOrder(userId: string, orderId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/huy-don-hang`, { userId, orderId });
  }

  updateOrderStatus(userId: string, orderId: string, newStatus: string): Observable<any> {
    const url = `${this.baseUrl}/update-order-status`;
    const requestData = { userId, orderId, newStatus };
  
    return this.http.post(url, requestData);
  }
  
  getOrdersByUserId(userId: string): Observable<OrderResponse> {
    const url = `${this.baseUrl}/get-orders`;
    const body = { userId: userId };
  
    return this.http.post<OrderResponse>(url, body)
      .pipe(
        tap(response => console.log('Orders received:', response.orders)),
        catchError(error => {
          console.error('Error fetching orders:', error);
          throw error;
        })
      );
  }
  

  huyDonHang(requestData: any): Observable<any> {
    const url = `${this.baseUrl}/huy-don-hang`;
    return this.http.post(url, requestData);
  }

  // If you need a method to delete all orders (uncomment the server-side route first)
  // deleteAllOrders(): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/don_hang/delete-all`);
  // }

  getAllOrders(): Observable<OrderResponse> {
    const url = `${this.baseUrl}/get-all-orders`;
    
    return this.http.get<OrderResponse>(url);
  }



}
