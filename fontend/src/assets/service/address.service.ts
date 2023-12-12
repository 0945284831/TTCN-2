// address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private host = 'https://provinces.open-api.vn/api/';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    const apiUrl = `${this.host}?depth=1`;
    return this.http.get(apiUrl);
  }

  getDistrictsByProvince(provinceCode: string): Observable<any> {
    const apiUrl = `${this.host}p/${provinceCode}?depth=2`;
    return this.http.get(apiUrl);
  }

  getWardsByDistrict(districtCode: string): Observable<any> {
    const apiUrl = `${this.host}d/${districtCode}?depth=2`;
    return this.http.get(apiUrl);
  }
}
