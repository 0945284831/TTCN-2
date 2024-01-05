import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../assets/service/auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private router: Router,
    private authService: AuthService,
    ) {}

  isActive(route: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl === route;
  }

  sidebarVisible: boolean = false;

  logout(): void {
    // Gọi phương thức đăng xuất từ AuthService
    this.authService.logout().subscribe(
      () => {
        // Thực hiện các hành động cần thiết sau khi đăng xuất
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
