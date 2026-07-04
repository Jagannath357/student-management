import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CourseService, Course } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { CourseDialogComponent } from './course-dialog.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'courseName',
    'department',
    'duration',
    'intakeCapacity',
    'actions',
  ];
  dataSource!: MatTableDataSource<Course>;
  isDarkMode = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Read state from storage to mirror theme profile tracking configurations
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open(
          'Error communicating with backend databases registry.',
          'Close',
          { duration: 3000 },
        );
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue === '') {
      this.loadCourses();
      return;
    }
    this.courseService.searchCourses(filterValue).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  checkLoginStatus(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openCourseDialog(courseData?: Course): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '500px',
      disableClose: true,
      data: courseData || null,
      panelClass: this.isDarkMode ? 'dark-dialog-panel' : 'light-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCourses();
    });
  }

  deleteCourse(course: Course): void {
    const confirmation = confirm(
      `Are you sure you want to permanently delete program: "${course.courseName}"?`,
    );
    if (confirmation && course.id) {
      this.courseService
        .deleteCourse(course.id)
        .subscribe(() => this.loadCourses());
    }
  }
}
