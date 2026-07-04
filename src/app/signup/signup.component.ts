import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Intercepts global theme notifications instantaneously[cite: 1]
    this.themeSub = this.themeService.isDark$.subscribe((mode) => {
      this.isDarkMode = mode;
    });

    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const { username, password } = this.signupForm.value;
      this.authService.register({ username, password }).subscribe({
        next: () => {
          this.snackBar.open(
            'Registration successful! Please sign in.',
            'Success',
            {
              duration: 4000,
              panelClass: ['success-snackbar'],
            },
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackBar.open(
            err.error.message ||
              'Registration failed. Try a different username.',
            'Close',
            {
              duration: 4000,
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
