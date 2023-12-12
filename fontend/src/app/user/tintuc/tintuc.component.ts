import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../assets/service/new.service';

@Component({
  selector: 'app-tintuc',
  templateUrl: './tintuc.component.html',
  styleUrls: ['./tintuc.component.css']
})
export class TintucComponent implements OnInit {
  newsList: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe(
      (data) => {
        console.log('API Response:', data);
        this.newsList = data;
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }
}
