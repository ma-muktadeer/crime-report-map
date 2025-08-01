import { Routes } from '@angular/router';

export const ADMIN_ROUTING: Routes = [
  {
    path: 'user-list',
    loadComponent: () => import('./user-list/user-list.component')
  },
  {
    path: 'permission-list', loadComponent:()=> import('./permission/permission.component').then(r=>r.PermissionComponent), pathMatch: 'full',
  },
  {
    path: 'role-list', loadComponent: ()=>import('./role/role.component').then(r=>r.RoleComponent), pathMatch: 'full',
  },
  {
    path: 'manage-role', loadComponent: ()=>import('./manage-role/manage-role.component').then(r=>r.ManageRoleComponent), pathMatch: 'full',
  },
  {
    path: 'profile', loadComponent:()=>import('./user/profile/profile.component').then(c=>c.ProfileComponent), pathMatch:'full',
  },
  {
    path: 'add-seat', loadComponent:()=>import('./add-parmanent-seat/add-parmanent-seat.component').then(c=>c.AddParmanentSeatComponent), pathMatch:'full',
  },
];