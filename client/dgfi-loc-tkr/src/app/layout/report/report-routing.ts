import { Routes } from '@angular/router';

export const REPORT_ROUTING: Routes = [
    { path: 'timely', loadComponent: () => import('./timely-chart/timely-chart.component').then(c => c.TimelyChartComponent), pathMatch: 'full' },
    { path: 'interval', loadComponent: () => import('./time-interval-report/time-interval-report.component').then(c => c.TimeIntervalReportComponent), pathMatch: 'full' },
    { path: 'compare', loadComponent: () => import('./compare-report/compare-report.component').then(c => c.CompareReportComponent), pathMatch: 'full' },
    { path: 'economic', loadComponent: () => import('./economic-report/economic-report.component').then(c => c.EconomicReportComponent), pathMatch: 'full' },
    { path: 'tabular', loadComponent: () => import('./tabular-report/tabular-report.component').then(c => c.TabularReportComponent), pathMatch: 'full' },
    { path: 'map', loadComponent: () => import('./map-report/map-report.component').then(c => c.MapReportComponent), pathMatch: 'full' },
    
  ];
  