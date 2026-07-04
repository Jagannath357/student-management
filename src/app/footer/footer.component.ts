import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
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
