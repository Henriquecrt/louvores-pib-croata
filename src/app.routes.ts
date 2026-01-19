import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  // Rota de Login
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'repertoire',
    loadComponent: () => import('./pages/repertoire/repertoire.component').then(m => m.RepertoireComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services-list/services-list.component').then(m => m.ServicesListComponent)
  },
  {
    path: 'services/:id',
    loadComponent: () => import('./pages/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
  },
  // NOVA ROTA: Estatísticas
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats/stats.component').then(m => m.StatsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];