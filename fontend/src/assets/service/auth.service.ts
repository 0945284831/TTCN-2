// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  userId: string;
  _id: string;
  // Add other properties from the response if needed
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth'; // Update URL to match your API

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(
          (response: LoginResponse) => {
            // Save userId to localStorage on successful login
            localStorage.setItem('_id', response._id);
            // Set login status to true
            this.setLoginStatus(true);
  
            // Log the userId to the console
            console.log('Logged in userId:', response.userId);
          },
          (error) => {
            // Log any errors that occur during the request
            console.error('Login Error:', error);
          }
        )
      );
  }
  
  logout(): Observable<any> {
    // Remove login status from localStorage on logout
    localStorage.removeItem('isLoggedIn');
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  deleteAllUsers(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-all`);
  }

  setLoginStatus(status: boolean): void {
    // Save login status to localStorage
    localStorage.setItem('isLoggedIn', status.toString());
  }

  getLoginStatus(): boolean {
    // Get login status from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  }

  getUserId(): string | null {
    // Get userId from localStorage
    return localStorage.getItem('_id');
  }
  
}
