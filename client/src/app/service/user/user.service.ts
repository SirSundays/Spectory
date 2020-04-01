import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  node_url = 'http://localhost:4000';

  getFullName(email) {
    let param = new HttpParams().set('email', email);
    return this.http.get(this.node_url + '/api/user/fullname', { params: param });
  }
}
