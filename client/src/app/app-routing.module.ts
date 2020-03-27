import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppAuthGuard } from './app.authguard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AppAuthGuard], 
    data: { roles: ['Admin'] }
  },
  { 
    path: 'about', 
    component: AboutComponent ,
    canActivate: [AppAuthGuard], 
    data: { roles: [] }
  },
 ];

 @NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule {}
