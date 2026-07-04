import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;

  // Theme state synchronization tracking
  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Listen to real-time theme updates synced with local storage
    this.themeSub = this.themeService.isDark$.subscribe((mode) => {
      this.isDarkMode = mode;
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('userToken', res.username);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.snackBar.open(
            err.error.message ||
              'Authentication rejected. Check user parameters.',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}
