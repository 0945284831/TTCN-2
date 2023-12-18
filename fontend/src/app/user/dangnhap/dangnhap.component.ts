import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../assets/service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dangnhap',
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.css']
})
export class DangnhapComponent implements OnInit {
  subCategories = [
    { title: 'Tô-Chén-Dĩa', imageUrl: '../../../assets/img/danhmuc_1.png' },
    { title: 'Phụ kiện trà - cà phê', imageUrl: '../../../assets/img/danhmuc_2.png' },
    { title: 'Ly sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_3.png' },
    { title: 'Túi vải canvas', imageUrl: '../../../assets/img/danhmuc_4.png' },
    { title: 'Hộp sứ dưỡng sinh', imageUrl: '../../../assets/img/danhmuc_5.png' },
    { title: 'Bộ Trà', imageUrl: '../../../assets/img/danhmuc_6.png' },
 ];
  responsiveOptions: any[] | undefined;
  form!: FormGroup;
  loginError!: string;
  value!: string;

  constructor( private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit() {
    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  this.initForm();
    
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công' });
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      matKhau: ['', Validators.required],
    });
  }

  login(): void {
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email,
        password: this.form.value.matKhau,
      };
  
      this.authService.login(credentials).subscribe(
        (response) => {
          // Handle login response
          console.log(response);
  
          if (response.success) {
            if (response.isAdmin) {
              // Redirect to the admin page if the user is an admin
              this.router.navigate(['/admin']);
            } else {
              // Redirect to the user home page if the user is not an admin
              this.router.navigate(['/user/home']).then(() => {
                // Save the login status
                this.authService.setLoginStatus(true);
  
                // Call the showSuccess method
                this.showSuccess();
              });
            }
          } else {
            // Handle unsuccessful login
            console.error('Login unsuccessful:', response.message);
            
            // Call the showError method
            this.showError(response.message);
  
            this.loginError = 'Email hoặc Mật khẩu không đúng!';
          }
        },
        (error) => {
          // Handle login error
          console.error(error);
  
          // Call the showError method
          this.showError('Đã xảy ra lỗi khi đăng nhập.');
  
          this.loginError = 'Email hoặc Mật khẩu không đúng!';
        }
      );
    }
  }
  
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}

