//sub-category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubCategory {
  subCategoryId: string;
  subCategoryName: string;
  mainCategoryId: string;
  mainCategoryName?: string; // Add property for mainCategoryName
}

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private apiUrl = 'http://localhost:3000/api/subcategories';

  constructor(private http: HttpClient) {}

  getSubCategoriesByMainCategory(mainCategoryId: string): Observable<SubCategory[]> {
    const url = `${this.apiUrl}/mainCategory/${mainCategoryId}`;
    return this.http.get<SubCategory[]>(url);
  }
  

  // Modify the method to include mainCategoryName
  getSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.apiUrl);
  }

  addSubCategory(subCategoryName: string, mainCategoryId: string): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.apiUrl, { subCategoryName, mainCategoryId });
  }
  getMainCategoryName(mainCategoryId: string): Observable<string> {
    const mainCategoryApiUrl = `http://localhost:3000/api/maincategories/${mainCategoryId}/name`;
    return this.http.get<string>(mainCategoryApiUrl);
  }
  deleteSubCategory(subCategoryId: string): Observable<any> {
    const url = `${this.apiUrl}/${subCategoryId}`;
    return this.http.delete(url);
  }
}
