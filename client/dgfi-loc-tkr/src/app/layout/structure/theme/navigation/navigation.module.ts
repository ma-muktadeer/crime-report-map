import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NavCollapseComponent } from './nav-content/nav-collapse/nav-collapse.component';
import { NavContentComponent } from './nav-content/nav-content.component';
import { NavGroupComponent } from './nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './nav-content/nav-item/nav-item.component';
import { NavigationComponent } from './navigation.component';


@NgModule({
  declarations: [
    NavigationComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    RouterModule
  ],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
