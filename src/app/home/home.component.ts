import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.isDark$.subscribe((mode) => {
      this.isDarkMode = mode;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSub) this.themeSub.unsubscribe();
  }
}
