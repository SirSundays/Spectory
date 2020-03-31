import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppAuthGuard } from './app.authguard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderRequestOverviewComponent } from './components/order-request-overview/order-request-overview.component';

const order_request = 'order-request'

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
  }
 ];

 @NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule {}
