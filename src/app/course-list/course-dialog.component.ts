import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService, Course } from '../services/course.service';

@Component({
  selector: 'app-course-dialog',
  template: `
    <div [class.dialog-dark-wrapper]="isDarkTheme">
      <h2 mat-dialog-title class="form-title">
        {{ isEditMode ? 'Modify Program Data' : 'Establish New Course' }}
      </h2>
      <mat-dialog-content [formGroup]="courseForm" class="dialog-form-layout">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Course / Program Name</mat-label>
          <input
            matInput
            formControlName="courseName"
            placeholder="Ex. Civil Engineering"
            required
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Academic Department</mat-label>
          <mat-select formControlName="department" required>
            <mat-option value="Engineering">Engineering</mat-option>
            <mat-option value="Information Technology"
              >Information Technology</mat-option
            >
            <mat-option value="Management">Management</mat-option>
            <mat-option value="Science & Arts">Science & Arts</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Duration</mat-label>
            <mat-select formControlName="duration" required>
              <mat-option value="1 Year">1 Year</mat-option>
              <mat-option value="2 Years">2 Years</mat-option>
              <mat-option value="3 Years">3 Years</mat-option>
              <mat-option value="4 Years">4 Years</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Intake Seat Capacity</mat-label>
            <input
              matInput
              type="number"
              formControlName="intakeCapacity"
              min="1"
              required
            />
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          [disabled]="courseForm.invalid"
          (click)="onSave()"
          class="save-btn"
        >
          Save Configuration
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-dark-wrapper {
        background: #27374d;
        color: white;
      }

      .form-title {
        color: white;
      }

      .dialog-form-layout {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 18px;
      }

      .form-row mat-form-field {
        flex: 1;
      }

      .cancel-btn {
        color: white;
        background-color: #27374d;
      }
      .save-btn {
        color: white;
        background-color: #09489f;
      }
    `,
  ],
})
export class CourseDialogComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = false;
  isDarkTheme = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course | null,
  ) {}

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.isEditMode = !!this.data;

    this.courseForm = this.fb.group({
      courseName: [this.data?.courseName || '', [Validators.required]],
      department: [this.data?.department || '', [Validators.required]],
      duration: [this.data?.duration || '', [Validators.required]],
      intakeCapacity: [
        this.data?.intakeCapacity || '',
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSave(): void {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      if (this.isEditMode && this.data?.id) {
        this.courseService
          .updateCourse(this.data.id, formValue)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.courseService
          .addCourse(formValue)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
