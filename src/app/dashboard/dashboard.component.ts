import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  totalCourses = 0;
  maleCount = 0;
  femaleCount = 0;

  // High-impact state controller tracking global theme
  isDarkMode = false;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Read and synchronize active theme token state immediately on lifecycle initialization[cite: 1]
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadDashboardMetrics();
  }

  loadDashboardMetrics(): void {
    this.studentService.getStudents().subscribe((students: Student[]) => {
      this.totalStudents = students.length;
      this.maleCount = students.filter((s) => s.gender === 'Male').length;
      this.femaleCount = students.filter((s) => s.gender === 'Female').length;

      const courses = students.map((s) => s.course);
      this.totalCourses = new Set(courses).size;
    });
  }

  get checkLoginStatus(): boolean {
    return this.authService.isLoggedIn();
  }

  // Toggles layout variables and saves setting to persistent client storage state
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
