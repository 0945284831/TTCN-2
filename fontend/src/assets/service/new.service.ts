import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addNews(newsData: any): Observable<any> {
    return this.http.post(this.apiUrl, newsData);
  }

  // Thêm các phương thức khác nếu cần
}
