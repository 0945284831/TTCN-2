// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post(`${this.baseUrl}/update-order-status`, { userId, orderId, newStatus });
  }

  // If you need a method to delete all orders (uncomment the server-side route first)
  // deleteAllOrders(): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/don_hang/delete-all`);
  // }
}
