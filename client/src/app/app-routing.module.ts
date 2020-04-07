import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppAuthGuard } from './app.authguard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderRequestOverviewComponent } from './components/order-request-overview/order-request-overview.component';
import { ParcelTrackingOverviewComponent } from './components/parcel-tracking-overview/parcel-tracking-overview.component';

const order_request = 'order-request'
const parcelTracking = 'parcel-tracking'

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AppAuthGuard], 
    data: { roles: ['basic'] }
  },
  {
    path: order_request + '/overview',
    component: OrderRequestOverviewComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['basic'] }
  },
  {
    path: order_request + '/overview/:id',
    component: OrderRequestOverviewComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['basic'] }
  },
  {
    path: parcelTracking + '/overview',
    component: ParcelTrackingOverviewComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['basic'] }
  },
  {
    path: parcelTracking + '/overview/:id',
    component: ParcelTrackingOverviewComponent,
    canActivate: [AppAuthGuard],
    data: { roles: ['basic'] }
  },
  {
      path: '**',
      redirectTo: '/dashboard',
      pathMatch: 'full'
  }
 ];

 @NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule {}
