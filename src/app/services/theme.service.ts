import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Read initial cache state from localStorage directly
  private isDarkSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'dark',
  );

  // Expose stream as an Observable that any component can listen to reactively
  isDark$: Observable<boolean> = this.isDarkSubject.asObservable();

  constructor() {
    this.applyGlobalBodyClass(this.isDarkSubject.value);
  }

  toggleTheme(): void {
    const currentMode = this.isDarkSubject.value;
    const nextMode = !currentMode;

    this.isDarkSubject.next(nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
    this.applyGlobalBodyClass(nextMode);
  }

  getCurrentTheme(): boolean {
    return this.isDarkSubject.value;
  }

  private applyGlobalBodyClass(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
