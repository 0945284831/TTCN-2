import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../assets/service/auth.service';


@Component({
  selector: 'app-dangky',
  templateUrl: './dangky.component.html',
  styleUrls: ['./dangky.component.css']
})
export class DangkyComponent implements OnInit {
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

  constructor( private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) { }

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

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register(): void {
    if (this.form.valid) {
      const user = {
        name: this.form.value.name,
        email: this.form.value.email,
        phone: this.form.value.phone,
        password: this.form.value.password,
        isAdmin: false, 
      };

      this.authService.register(user).subscribe(
        (response) => {
          // Handle successful registration response
          console.log(response);
        },
        (error) => {
          // Handle registration error
          console.error(error);
        }
      );
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
