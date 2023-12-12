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
  provinceSelected: boolean = false;
  districtSelected: boolean = false;

  selectedProvinceCode!: string;
  selectedDistrictCode!: string;

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
  
    // Enable the district dropdown and disable the ward dropdown
    this.provinceSelected = true;
    this.districtSelected = false;
  
    // Reset the district and ward selections
    this.selectedDistrict = '';
    this.selectedWard = '';
  }
  
  onDistrictChange(): void {
    const selectedDistrictCode = this.selectedDistrict;
  
    // Gửi mã quận/huyện lên API để lấy danh sách phường/xã
    this.addressService.getWardsByDistrict(selectedDistrictCode).subscribe((data) => {
      this.wards = data.wards;
    });
  
    // Enable the ward dropdown
    this.districtSelected = true;
    
  }

  onSubmit() {
    if (this.addressForm.valid) {
      // Lấy giá trị từ form
      const formValue = this.addressForm.value;

      // Tạo đối tượng ContactInfo từ giá trị form
      const newContactInfo: ContactInfo = {
        fullName: formValue.fullName,
        phone: formValue.phone,
        address: formValue.address,
        country: 'Vietnam', // Bạn có thể cung cấp quốc gia theo nhu cầu
        province: formValue.province,
        district: formValue.district,
        ward: formValue.ward,
        zipCode: formValue.zipCode,
        isDefault: formValue.isDefault,
        _id: '', // Để trống hoặc bạn có thể tạo ID duy nhất nếu cần
      };

      // Gọi service để thêm địa chỉ mới cho người dùng
      this.userService.addContactInfo(this.userId, newContactInfo).subscribe(
        (response) => {
          console.log('New contact info added successfully:', response);
          // Thực hiện các hành động cần thiết sau khi thêm địa chỉ

          // Đóng dialog
          this.visible = false;
        },
        (error) => {
          console.error('Error adding contact info:', error);
          // Xử lý lỗi nếu cần thiết
        }
      );
    }
  }

  
  
  
  
}
