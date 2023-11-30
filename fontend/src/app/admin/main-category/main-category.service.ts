// main-category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategory } from '../sub-category/sub-category.service';
import { map } from 'rxjs/operators';

// Add the 'export' keyword to make MainCategory accessible outside of this file
export interface MainCategory {
  mainCategoryId: string;
  mainCategoryName: string;
  subCategoryIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
  private apiUrl = 'http://localhost:3000/api/maincategories';

  constructor(private http: HttpClient) {}

  getMainCategory(mainCategoryId: string): Observable<MainCategory> {
    const url = `${this.apiUrl}/${mainCategoryId}`;
    return this.http.get<MainCategory>(url);
  }
  getMainCategories(): Observable<MainCategory[]> {
    return this.http.get<MainCategory[]>(this.apiUrl);
  }

  addMainCategory(mainCategoryName: string): Observable<MainCategory> {
    return this.http.post<MainCategory>(this.apiUrl, { mainCategoryName });
  }

  updateMainCategory(mainCategoryId: string, mainCategoryName: string): Observable<MainCategory> {
    const url = `${this.apiUrl}/${mainCategoryId}`;
    return this.http.put<MainCategory>(url, { mainCategoryName });
  }

  deleteMainCategory(mainCategoryId: string): Observable<any> {
    const url = `${this.apiUrl}/${mainCategoryId}`;
    return this.http.delete(url);
  }
  getSubCategoriesByMainCategory(mainCategoryId: string): Observable<SubCategory[]> {
    const url = `${this.apiUrl}/${mainCategoryId}/subcategories`;
    return this.http.get<SubCategory[]>(url);
  }
}
