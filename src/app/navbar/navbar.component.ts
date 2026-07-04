import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Listen to the shared theme subject for real-time mode changes
    this.themeSub = this.themeService.isDark$.subscribe((mode) => {
      this.isDarkMode = mode;
    });
  }

  checkLoginStatus(): boolean {
    return this.authService.isLoggedIn();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.themeSub) this.themeSub.unsubscribe();
  }
}
