import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
export interface News {
  title: string;
  author: string;
  content: string;
  tags: string;
  newsImage : string[];
  publishedAt: string;
}
@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getNewsDetail(newsId: string): Observable<any> {
    const url = `${this.apiUrl}/${newsId}`;
    return this.http.get(url);
  }

  addNews(newsData: FormData) {
    this.http.post<{ news: News }>(this.apiUrl, newsData)
      .subscribe(
        (response) => {
          // Handle the response as needed
          console.log('news added successfully:', response.news);
        },
        (error) => {
          console.error('Error adding news:', error);
          // Handle the error, show a message, etc.
        }
      );
  }

  // Thêm các phương thức khác nếu cần
}
