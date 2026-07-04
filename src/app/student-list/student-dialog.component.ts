import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService, Student } from '../services/student.service';
import { CourseService, Course } from '../services/course.service';

@Component({
  selector: 'app-student-dialog',
  template: `
    <!-- High-Contrast Theme Context Form Element Wrapper Component Layer -->
    <div [class.dialog-dark-wrapper]="isDarkTheme">
      <h2 mat-dialog-title class="form-title">
        {{ isEditMode ? 'Modify Student Profile' : 'Register New Student' }}
      </h2>

      <mat-dialog-content [formGroup]="studentForm" class="dialog-form-layout">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="John Doe"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="john@example.com"
              required
            />
            <mat-error *ngIf="studentForm.get('email')?.hasError('email')"
              >Provide a valid email pattern structure.</mat-error
            >
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>10-Digit Mobile Number</mat-label>
            <input
              matInput
              formControlName="mobileNumber"
              placeholder="9876543210"
              maxlength="10"
              required
            />
            <mat-error
              *ngIf="studentForm.get('mobileNumber')?.hasError('pattern')"
              >Mobile track sequence must be exactly 10-digits[cite:
              1].</mat-error
            >
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Allocated Course Track</mat-label>
            <mat-select formControlName="course" required>
              <mat-option
                *ngFor="let course of availableCourses"
                [value]="course.courseName"
              >
                {{ course.courseName }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="dateOfBirth"
              required
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div class="radio-group-container">
            <label class="radio-label">Gender: </label>
            <mat-radio-group formControlName="gender" color="primary" required>
              <mat-radio-button value="Male">Male</mat-radio-button>
              <mat-radio-button value="Female">Female</mat-radio-button>
            </mat-radio-group>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Residential Address Description</mat-label>
          <textarea
            matInput
            formControlName="address"
            rows="3"
            placeholder="Street layout details..."
            required
          ></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          [disabled]="studentForm.invalid"
          (click)="onSave()"
        >
          Save Configuration
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-form-layout {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-top: 12px !important;
      }
      .full-width {
        width: 100%;
      }
      .form-row {
        display: flex;
        gap: 16px;
      }
      .form-row mat-form-field {
        flex: 1;
      }
      .radio-group-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        padding-left: 4px;
      }
      .radio-label {
        font-size: 14px;
        color: #475569;
        font-weight: 500;
      }

      /* ===================================================================
         Contextual Dialog View Overrides Mapping (Neon Dark Theme Layer)
         =================================================================== */
      .dialog-dark-wrapper {
        background-color: #111827;
        color: #f1f5f9;
        margin: -24px;
        padding: 24px;
        border-radius: 4px;
      }
      .dialog-dark-wrapper .form-title {
        color: #ffffff;
      }
      .dialog-dark-wrapper ::v-deep .mat-mdc-text-field-wrapper {
        background-color: #161f38 !important;
      }
      .dialog-dark-wrapper ::v-deep .mat-mdc-form-field-label {
        color: #94a3b8 !important;
      }
      .dialog-dark-wrapper ::v-deep .mat-mdc-input-element,
      .dialog-dark-wrapper ::v-deep .mat-mdc-select-value {
        color: #ffffff !important;
      }
      .dialog-dark-wrapper .radio-label {
        color: #94a3b8;
      }
      .dialog-dark-wrapper ::v-deep .mat-mdc-radio-button {
        color: #e2e8f0 !important;
      }
      .dialog-dark-wrapper .cancel-btn {
        color: #94a3b8;
      }
    `,
  ],
})
export class StudentDialogComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode = false;

  // Property to evaluate whether modal panel scales into dark mode
  isDarkTheme = false;
  availableCourses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private courseService: CourseService,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student | null,
  ) {}

  ngOnInit(): void {
    // Intercept storage properties to render consistent layout parameters
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.isEditMode = !!this.data;
    this.loadActiveCourses();

    // Mandatory formatting validation rules logic pipeline definitions[cite: 1]
    this.studentForm = this.fb.group({
      name: [this.data?.name || '', [Validators.required]],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      mobileNumber: [
        this.data?.mobileNumber || '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ], // 10-digit mobile number constraint check[cite: 1]
      course: [this.data?.course || '', [Validators.required]],
      address: [this.data?.address || '', [Validators.required]],
      gender: [this.data?.gender || 'Male', [Validators.required]],
      dateOfBirth: [
        this.data?.dateOfBirth ? new Date(this.data.dateOfBirth) : '',
        [Validators.required],
      ],
    });
  }

  loadActiveCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res) => (this.availableCourses = res),
      error: () =>
        console.error(
          'Failed to resolve dynamic course dropdown arrays from schema server rows.',
        ),
    });
  }

  onSave(): void {
    if (this.studentForm.valid) {
      const rawValues = this.studentForm.value;
      const formattedDate = new Date(rawValues.dateOfBirth)
        .toISOString()
        .split('T')[0];

      const payload: Student = {
        ...rawValues,
        dateOfBirth: formattedDate,
      };

      if (this.isEditMode && this.data?.id) {
        this.studentService.updateStudent(this.data.id, payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: () =>
            alert('Error executing database mutations update profile.'),
        });
      } else {
        this.studentService.createStudent(payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: () =>
            alert('Error committing profile payload schema to database.'),
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
