import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppAuthGuard } from './app.authguard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
    data: { roles: ['Basic'] }
  }
 ];

 @NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule {}
