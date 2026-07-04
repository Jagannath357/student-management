import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentListComponent } from './student-list/student-list.component';
import { CourseListComponent } from './course-list/course-list.component';

// Import the new profile details view component
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Secured Paths
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },

  // New Dynamic Parameter Path for student records profile view
  {
    path: 'student/:id',
    component: StudentDetailComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
