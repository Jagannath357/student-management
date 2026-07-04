import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css'],
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  student: Student | null = null;
  isDarkMode = false;

  private themeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to the shared centralized reactive theme stream updates
    this.themeSub = this.themeService.isDark$.subscribe((mode) => {
      this.isDarkMode = mode;
    });

    // 2. Fetch parameter id string token out from current URL route snapshot
    const studentIdStr = this.route.snapshot.paramMap.get('id');
    if (studentIdStr) {
      const id = Number(studentIdStr);
      this.loadStudentProfile(id);
    }
  }

  loadStudentProfile(id: number): void {
    // Calls the Spring Boot backend API endpoint (GET /api/students/{id})
    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (err) => {
        console.error(
          'Failed to locate target user data mapping from database schema indexes.',
          err,
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}
