import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { SignInPageComponent } from './auth/sign-in.page';
import { SignUpPageComponent } from './auth/sign-up.page';
import { CatalogPageComponent } from './catalog/catalog.page';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  { path: 'sign-in', component: SignInPageComponent },
  { path: 'sign-up', component: SignUpPageComponent },
  { path: 'catalog', canActivate: [authGuard], component: CatalogPageComponent },
  { path: '**', redirectTo: 'catalog' },
];
