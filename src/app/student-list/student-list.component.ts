import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { AuthService } from '../services/auth.service';
import { StudentDialogComponent } from './student-dialog.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'mobileNumber',
    'course',
    'actions',
  ];
  dataSource!: MatTableDataSource<Student>;

  // Theme state synchronizer mapping tracking property
  isDarkMode = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Read the synchronized global theme token entry on initialization sequence[cite: 1]
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open(
          'Error establishing system connections to target API schema tables.',
          'Close',
          { duration: 4000 },
        );
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();

    if (filterValue === '') {
      this.loadStudents();
      return;
    }

    this.studentService.searchStudents(filterValue).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open(
          'Error parsing database query lookup pattern indexes evaluation.',
          'Dismiss',
          { duration: 3000 },
        );
      },
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    // Set theme value explicitly to localStorage profiles state storage maps
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  checkLoginStatus(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openStudentDialog(student?: Student) {
    this.dialog.open(StudentDialogComponent, {
      width: '750px',
      data: student,
      panelClass: this.isDarkMode ? 'dark-dialog' : '',
    });
  }

  deleteStudent(student: Student): void {
    const confirmation = confirm(
      `Are you sure you want to drop student record: "${student.name}" permanently from the database?`,
    );
    if (confirmation && student.id) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.loadStudents();
          this.snackBar.open(
            'Student profile dropped from active indexing registries.',
            'Dismiss',
            { duration: 3000 },
          );
        },
        error: () => {
          this.snackBar.open(
            'Failed to complete safe drop operation metrics cascading.',
            'Close',
            { duration: 4000 },
          );
        },
      });
    }
  }
  // Append this method inside your existing StudentListComponent class definition
  viewStudent(student: Student): void {
    if (student.id) {
      this.router.navigate(['/student', student.id]);
    }
  }
}
