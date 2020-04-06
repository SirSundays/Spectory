import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private keycloakAngular: KeycloakService) { }

  node_url = 'http://localhost:4000';
  roles = ['basic', 'admin'];

  getFullName(email) {
    let param = new HttpParams().set('email', email);
    return this.http.get(this.node_url + '/api/user/fullname', { params: param });
  }

  getUserRoles() {
    try {
      let userRoles = [];
      this.roles.forEach(role => {
        if (this.keycloakAngular.getKeycloakInstance().hasRealmRole(role)) {
          userRoles.push(role);
        }
      });
      return userRoles;
    } catch (e){
      return [];
    }
  }

  getAllBasicUser() {
    return this.http.get(this.node_url + '/api/user/allBasicUser');
  }

  getAllPurchaserUser() {
    return this.http.get(this.node_url + '/api/user/allPurchaserUser');
  }
}
