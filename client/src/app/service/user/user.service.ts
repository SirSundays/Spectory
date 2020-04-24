import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private keycloakAngular: KeycloakService) { }

  node_url = environment.nodejs_ip;
  roles = ['basic', 'admin', 'purchaser', 'student'];

  getUserRoles() {
    try {
      let userRoles = [];
      this.roles.forEach(role => {
        if (this.keycloakAngular.getKeycloakInstance().hasRealmRole(role)) {
          userRoles.push(role);
        }
      });
      return userRoles;
    } catch (err) {
      return [];
    }
  }

  async getOwnEmail() {
    try {
      return await this.keycloakAngular.getKeycloakInstance().loadUserProfile();
    }
    catch (err) {
      return '';
    }
  }

  getAllBasicUser() {
    return this.http.get(this.node_url + '/api/user/allBasicUser');
  }

  getAllPurchaserUser() {
    return this.http.get(this.node_url + '/api/user/allPurchaserUser');
  }
}
