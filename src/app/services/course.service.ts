import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: number;
  courseName: string;
  department: string;
  duration: string;
  intakeCapacity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // Target URL pointing directly to your Spring Boot Backend Controller
  private apiUrl =
    'https://student-management-backend-rh0k.onrender.com/api/courses';

  constructor(private http: HttpClient) {}

  // Fetch all data from the database
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, updatedCourse: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, updatedCourse);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Database-driven search via backend filtering endpoint
  searchCourses(name: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/search/${name}`);
  }
}
