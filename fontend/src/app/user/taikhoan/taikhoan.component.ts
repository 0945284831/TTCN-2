import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../assets/service/auth.service';
import { UserService } from '../../../assets/service/user.service';
import { User, ContactInfo } from '../../../assets/service/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { AddressService } from '../../../assets/service/address.service';

@Component({
  selector: 'app-taikhoan',
  templateUrl: './taikhoan.component.html',
  styleUrls: ['./taikhoan.component.css']
})
export class TaikhoanComponent implements OnInit {
  userId!: string;
  user!: User;
  contactInfo!: ContactInfo;
  contactInfoCount: number = 0;
  contactInfoForm!: FormGroup;

  addressForm!: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];


  selectedProvince: string = '';
  selectedDistrict: string = '';
  selectedWard: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder, 
    private addressService: AddressService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';
    console.log('User Id:', this.userId);

    // Gọi service để lấy thông tin người dùng
    this.userService.getUser(this.userId).subscribe(
      (response) => {
        this.user = response.user;
        // Initialize contactInfoItem with the first element (if it exists)
        this.contactInfo = this.user.contactInfo?.[0];
        this.contactInfoCount = this.user.contactInfo?.length || 0;
      },
      (error) => {
        console.error('Error getting user:', error);
        if (error instanceof HttpErrorResponse) {
          console.error(`Status: ${error.status}, Message: ${error.message}`);
          // Log thêm thông tin chi tiết nếu có
          console.error('Error Details:', error.error);
        }
      }
    );

    this.initForm();
    this.loadProvinces();
    // this.addressForm = this.formBuilder.group({
    //   province: [''],
    //   district: [''],
    //   ward: [''],
    //   fullName: [''],
    //   phone: [''],
    //   address: [''],
    //   zipCode: [''],
    //   isDefault: [''],
    // });
  }

  selectedTab: string = 'info'; 

  showInfo() {
    this.selectedTab = 'info';
  }

  showOrders() {
    this.selectedTab = 'orders';
  }

  showAddress() {
    this.selectedTab = 'address';
  }

  visible: boolean = false;

  showDialog() {
        this.visible = true;
        this.contactInfo = {
          fullName: '',
          phone: '',
          address: '',
          country: '', // Thêm country
          province: '',
          district: '',
          ward: '',
          zipCode: '',
          isDefault: false,
          _id: '', // Thêm _id
        };
  }


  private initForm(): void {
    this.addressForm = this.fb.group({
      province: [''],
      district: [''],
      ward: [''],
      fullName: [''],
      phone: [''],
      address: [''],
      zipCode: [''],
      isDefault: [''],
    });
  }

  private loadProvinces(): void {
    this.addressService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });
  }

  onProvinceChange(): void {
    const selectedProvinceValue = this.selectedProvince;
    const [provinceCode, provinceName] = selectedProvinceValue.split(' ');
  
    // Gửi cả code và name tỉnh/thành phố lên API
    this.addressService.getDistrictsByProvince(provinceCode).subscribe((data) => {
      this.districts = data.districts;
    });
  
    // Lưu chỉ name vào biến selectedProvinceName để sử dụng khi cần
    const selectedProvinceName = provinceName;
  }
  
  onDistrictChange(districtCode: string): void {
    this.addressService.getWardsByDistrict(districtCode).subscribe((data) => {
      this.wards = data.wards;
    });
  }

 onSubmit() {
  console.log('Submit button clicked.');
  if (this.addressForm.valid) {
    const contactInfo: ContactInfo = this.addressForm.value;

    // Kiểm tra xem đó có phải là thông tin liên hệ mới hay cập nhật
    if (!this.contactInfo._id) {
      // Lấy userId từ đối tượng user
      const userId = this.user._id;

      // Lấy provinceName và districtName từ biến selectedProvince và selectedDistrict
      const [_, provinceName] = this.selectedProvince.split(' ');
      const [__, districtName] = this.selectedDistrict.split(' ');

      // Gửi thông tin liên hệ mới lên API với cả provinceName và districtName
      this.userService.addContactInfo(userId, { ...contactInfo, province: provinceName, district: districtName }).subscribe(
        (response) => {
          // Xử lý thành công, nếu cần
          console.log('Thông tin liên hệ được tạo thành công:', response);

          // Cập nhật contactInfo sau khi thêm thành công
          this.contactInfo = response.contactInfo;
        },
        (error) => {
          // Xử lý lỗi, nếu cần
          console.error('Lỗi khi tạo thông tin liên hệ:', error);
        }
      );
    } 
  } else {
    // Xử lý lỗi kiểm tra hợp lệ của form, nếu cần
  }
}

  
  
  
  
}
