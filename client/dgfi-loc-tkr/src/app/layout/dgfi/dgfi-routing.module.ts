import { Routes } from '@angular/router';
import { AddPoliticalComponent } from './add-political/add-political.component';
import { DgfiMapComponent } from './dgfi-map/dgfi-map.component';
import { EconomicComponent } from './economic/economic.component';

export const DGFI_ROUTING: Routes = [
  { path: 'add', loadComponent: () => import('./add-criminal/add-criminal.component').then(c => c.AddCriminalComponent), pathMatch: 'full' },
  { path: 'list', loadComponent: () => import('./criminal-list/criminal-list.component').then(c => c.CriminalListComponent), pathMatch: 'full' },

  { path: 'map', component: DgfiMapComponent, pathMatch: 'full' },
  { path: 'political', component: AddPoliticalComponent, pathMatch: 'full'},
  { path: 'economic', component: EconomicComponent, pathMatch: 'full'},
];
