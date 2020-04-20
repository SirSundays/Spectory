import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userDetails: KeycloakProfile;

  constructor(private keycloakService: KeycloakService, public route: ActivatedRoute, private userService: UserService) {
    
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }
}