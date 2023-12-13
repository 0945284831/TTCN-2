import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NewsService} from '../../../../../assets/service/new.service'

@Component({
  selector: 'app-tintuc-add',
  templateUrl: './tintuc-add.component.html',
  styleUrls: ['./tintuc-add.component.css']
})
export class TintucAddComponent {
  news = {
    title: '',
    content: '',
    publishedAt: '',
    author: '',
    tags: '',
    newsImage: null as File | null  // Added for file upload
  };

  text: string | undefined;

  imageDataList: string[] = [];
  uploadedFiles: any[] = [];
  form!: FormGroup;

  constructor(
    private router: Router,
    private location: Location,
    private NewsService: NewsService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      publishedAt: ['', Validators.required],
      author: [''],  // Add an author field here
      tags: [''],
      newsImage: [null],  // Assuming newsImage is a File input
    });
  }
  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.clearImages();

    if (target && target.files && target.files.length > 0) {
      const files = target.files;
      this.uploadedFiles = [];
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (allowedMimeTypes.includes(file.type)) {
          const reader = new FileReader();

          reader.onload = () => {
            // Add image URL to the array
            this.imageDataList.push(reader.result as string);
          };

          reader.readAsDataURL(file);
        } else {
          // Handle invalid file types (if needed)
          console.error('Invalid file type:', file.type);
        }
      }

      // Update the form control to store the array of files
      this.form.patchValue({ newsImage: files });
      
    }

  }

  async addNews() {
    if (!this.form || !this.form.value) {
      console.error('Form or form value is undefined.');
      return;
    }
    const newsImage: File[] = this.form.value.newsImage;
    this.clearImages();
  
    if (newsImage && newsImage.length > 0) {
    const newsData = new FormData();
    newsData.append('title', this.form.value.title);
    newsData.append('content', this.form.value.content);
    newsData.append('author', this.form.value.author);
    newsData.append('tags', this.form.value.tags);
    // newsData.append('newsImage', this.news.newsImage as File);
    for (let i = 0; i < newsImage.length; i++) {
      newsData.append('newsImage', newsImage[i]);
    }
    try {
      await this.NewsService.addNews(newsData);
      this.router.navigate(['/admin/tintuc']);
    } catch (error) {
      console.error('Error adding tintuc:', error);
      // Handle errors, e.g., display a user-friendly error message
    }
  } else {
    console.error('No image file selected.');
  }

  this.form.reset();
}



  
  clearImages() {
    this.imageDataList = [];
    // Optionally, you can also clear the form control value
    this.location.go(this.location.path());
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.news.newsImage = file; // Assuming you want to store the image file in the "img" property
  }
  
}
