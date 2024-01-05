import { Component,OnInit } from '@angular/core';
import { ShoppingCart, ShoppingCartItem, ShoppingCartService } from '../../../assets/service/giohang.service'
import { OrderService } from '../../../assets/service/donhang.service';
import { AuthService } from '../../../assets/service/auth.service';
import { Router, NavigationEnd  } from '@angular/router';
import { AddressService } from '../../../assets/service/address.service';
import { User, ContactInfo } from '../../../assets/service/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../assets/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-thanhtoan',
  templateUrl: './thanhtoan.component.html',
  styleUrls: ['./thanhtoan.component.css']
})
export class ThanhtoanComponent implements OnInit{
  shoppingCart!: ShoppingCart ;
  shoppingCartItem!:ShoppingCartItem
  contactInfo!: ContactInfo;
  contactInfoadd!: ContactInfo;
  addressForm!: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  user!: User;
  contactInfoCount: number = 0;

  
  selectedProvince: string = '';
  selectedDistrict: string = '';
  selectedWard: string = '';
  provinceSelected: boolean = false;
  districtSelected: boolean = false;


  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private addressService: AddressService,
    private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService 




  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();

    if (userId) {
      // Lấy thông tin giỏ hàng khi component được khởi tạo
      this.shoppingCartService.getShoppingCartByUserId(userId).subscribe(
        (cart) => {
          this.shoppingCart = cart;
        },
        (error) => {
          console.error('Error loading shopping cart:', error);
        }
      );
    }

    this.initForm();
    this.loadProvinces();
    
    if (userId !== null) {
      this.userService.getUser(userId).subscribe(
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
    } else {
      // Handle the case where userId is null (e.g., show an error or redirect)
      console.error('User ID is null. Handle this case appropriately.');
    }
  }

  selectedTab: string = 'info'; 
  showAddress() {
    this.selectedTab = 'address';
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

  visible: boolean = false;
  showDialog() {
    this.visible = true;
    this.contactInfoadd = {
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

  onSubmit() {
    const userId = this.authService.getUserId();
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
      if (userId !== null && this.addressForm.valid) {
      // Gọi service để thêm địa chỉ mới cho người dùng
      this.userService.addContactInfo(userId, newContactInfo).subscribe(
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

handleThanhToan() {
  // Get the userId from AuthService
  const userId = this.authService.getUserId();

  // Check if the user is logged in
  if (!userId) {
    console.error('User is not logged in.');
    // Handle the case where the user is not logged in (redirect to login, show a message, etc.)
    return;
  }

  // Call the createOrder method from OrderService
  this.orderService.createOrder(userId).subscribe(
    (response) => {
      console.log('Order created successfully:', response);
      // Navigate to /user/hoanthanh upon successful order creation
      this.router.navigate(['/user/hoanthanh']);
    },
    (error) => {
      console.error('Error creating order:', error);
      // Handle errors (show an error message, log the error, etc.)
    }
  );
}
confirm1(event: Event) {
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Bạn có chắc chắn đặt hàng với địa chị đó?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'none',
    rejectIcon: 'none',
    rejectButtonStyleClass: 'p-button-text',
    accept: () => {
      this.handleThanhToan();
    },
    reject: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have rejected',
        life: 3000
      });
    }
  });
}

}
