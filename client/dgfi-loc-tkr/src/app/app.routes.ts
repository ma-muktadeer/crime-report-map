import { Routes } from '@angular/router';
import { StructureComponent } from './layout/structure/structure.component';
import { loginGuard } from './login/login.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './softcafe/guard/auth.guard';
import { securiedChildGuard } from './softcafe/guard/securied-child.guard';
import { securiedGuard } from './softcafe/guard/securied.guard';

export const routes: Routes = [

    {
        path: '',
        component: StructureComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./layout/dashord/dashord.component').then(r => r.DashordComponent),
                canActivate: [securiedGuard]
            },
            {
                path: 'admin', loadChildren: () => import('./layout/admin/admin-routing.module').then(r => r.ADMIN_ROUTING),
                canActivateChild: [securiedChildGuard]
            },
            { path: 'dgfi', loadChildren: () => import('./layout/dgfi/dgfi-routing.module').then(r => r.DGFI_ROUTING) },
            { path: 'report', loadChildren: () => import('./layout/report/report-routing').then(r => r.REPORT_ROUTING) },

            {
                path: 'page-not-found',
                component: PageNotFoundComponent,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component'),
        canActivate: [loginGuard]
    },

];
