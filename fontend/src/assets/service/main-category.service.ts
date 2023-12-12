// main-category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SubCategory } from './sub-category.service';
import { Product } from './product.service'

export interface MainCategory {
  mainCategoryId: string;
  mainCategoryName: string;
  subCategoryIds: string[];
  subCategories?: SubCategory[];
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
    return this.http.get<MainCategory[]>(this.apiUrl).pipe(
      switchMap(mainCategories => {
        const observables: Observable<SubCategory[]>[] = mainCategories.map(mainCategory =>
          this.getSubCategoriesByMainCategory(mainCategory.mainCategoryId)
        );
        return forkJoin(observables).pipe(
          map(subCategoriesArrays => {
            // Gán mỗi mainCategory.subCategories bằng subCategories tương ứng từ API
            mainCategories.forEach((mainCategory, index) => {
              mainCategory.subCategories = subCategoriesArrays[index];
            });
            return mainCategories;
          })
        );
      })
    );
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
  getProductsByMainCategory(mainCategoryId: string): Observable<Product[]> {
    const url = `${this.apiUrl}/${mainCategoryId}/products`;
    return this.http.get<Product[]>(url);
  }
}
