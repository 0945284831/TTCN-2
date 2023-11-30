import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private router: Router) {}

  isActive(route: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl === route;
  }

  sidebarVisible: boolean = false;
}
