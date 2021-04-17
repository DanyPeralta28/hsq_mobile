import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'viewer',
    loadChildren: () => import('./pages/viewer/viewer.module').then( m => m.ViewerPageModule)
  },
  {
    path: 'salidas',
    loadChildren: () => import('./pages/salidas/salidas.module').then( m => m.SalidasPageModule)
  },
  {
    path: 'entradas',
    loadChildren: () => import('./pages/entradas/entradas.module').then( m => m.EntradasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
