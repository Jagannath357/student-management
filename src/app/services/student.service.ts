import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  name: string;
  email: string;
  mobileNumber: string;
  course: string;
  address: string;
  gender: string;
  dateOfBirth: string; // ISO string format passed to database (YYYY-MM-DD)
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Target URL matching your backend server port 8090 setup
  private apiUrl = 'http://localhost:8090/api/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Uses backend name pattern filtering endpoint
  searchStudents(name: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/search/${name}`);
  }
}
