import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'

import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { OrderRequestOverviewComponent } from './components/order-request-overview/order-request-overview.component';
import { OrderRequestModalComponent } from './components/order-request-modal/order-request-modal.component';
import { OrderRequestDetailModalComponent } from './components/order-request-detail-modal/order-request-detail-modal.component';

let keycloakService: KeycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent, OrderRequestOverviewComponent, OrderRequestModalComponent, OrderRequestDetailModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    KeycloakAngularModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
    ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  entryComponents: [AppComponent]
})

export class AppModule implements DoBootstrap {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
  async ngDoBootstrap(app) {
    const { keycloakConfig } = environment;

    try {
      await keycloakService.init({ config: keycloakConfig });
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}