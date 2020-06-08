import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'

import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgxCsvParserModule } from 'ngx-csv-parser';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { OrderRequestOverviewComponent } from './components/order-request-overview/order-request-overview.component';
import { OrderRequestModalComponent } from './components/order-request-modal/order-request-modal.component';
import { OrderRequestDetailModalComponent } from './components/order-request-detail-modal/order-request-detail-modal.component';
import { OrderRequestProcessComponent } from './components/order-request-process/order-request-process.component';
import { OrderRequestModalImportComponent } from './components/order-request-modal-import/order-request-modal-import.component';
import { OrderRequestAllocateComponent } from './components/order-request-allocate/order-request-allocate.component';
import { ParcelTrackingOverviewComponent } from './components/parcel-tracking-overview/parcel-tracking-overview.component';
import { ParcelTrackingModalComponent } from './components/parcel-tracking-modal/parcel-tracking-modal.component';
import { ParcelTrackingDetailComponent } from './components/parcel-tracking-detail/parcel-tracking-detail.component';
import { ParcelTrackingMoreInfoComponent } from './components/parcel-tracking-more-info/parcel-tracking-more-info.component';
import { OrderRequestStudentModalComponent } from './components/order-request-student-modal/order-request-student-modal.component';
import { OrderRequestStudentOverviewComponent } from './components/order-request-student-overview/order-request-student-overview.component';
import { OrderRequestStudentQuickCreateComponent } from './components/order-request-student-quick-create/order-request-student-quick-create.component';
import { UserFileImportComponent } from './components/user-file-import/user-file-import.component';

let keycloakService: KeycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent, OrderRequestOverviewComponent, OrderRequestModalComponent, OrderRequestDetailModalComponent, OrderRequestProcessComponent, OrderRequestModalImportComponent, OrderRequestAllocateComponent, ParcelTrackingOverviewComponent, ParcelTrackingModalComponent, ParcelTrackingDetailComponent, ParcelTrackingMoreInfoComponent, OrderRequestStudentModalComponent, OrderRequestStudentOverviewComponent, OrderRequestStudentQuickCreateComponent, UserFileImportComponent,
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
    ReactiveFormsModule,
    NgSelectModule,
    NgxCsvParserModule
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