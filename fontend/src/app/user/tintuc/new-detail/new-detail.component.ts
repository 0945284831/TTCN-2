// new-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../../../assets/service/new.service';

@Component({
  selector: 'app-new-detail',
  templateUrl: './new-detail.component.html',
  styleUrls: ['./new-detail.component.css'],
})
export class NewDetailComponent implements OnInit {
  news: any;

  constructor(private route: ActivatedRoute, private newsService: NewsService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const newsId = params['id'];
      this.getNewsDetail(newsId);
    });
  }

  getNewsDetail(newsId: string): void {
    this.newsService.getNewsDetail(newsId).subscribe(
      (data) => {
        this.news = data;
      },
      (error) => {
        console.error('Error fetching news detail:', error);
      }
    );
  }
}
