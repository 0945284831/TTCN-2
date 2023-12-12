import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.interface'; // Đảm bảo import user interface từ file tương ứng

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000'; // Thay đổi URL để phù hợp với API của bạn

  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }
  
  addContactInfo(userId: string, contactInfo: any): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}/addContactInfo`;
    return this.http.post(url, contactInfo);
  }
}
