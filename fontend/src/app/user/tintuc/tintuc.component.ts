
import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../assets/service/new.service';
@Component({
  selector: 'app-tintuc',
  templateUrl: './tintuc.component.html',
  styleUrls: ['./tintuc.component.css']
})
export class TintucComponent {
  newsList: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    // Gọi service để lấy danh sách tin tức
    this.newsService.getNews().subscribe(
      (data) => {
        this.newsList = data; // Gán danh sách tin tức từ response vào mảng
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }
}
