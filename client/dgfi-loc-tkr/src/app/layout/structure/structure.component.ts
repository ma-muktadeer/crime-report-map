import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { NavBarModule } from './theme/nav-bar/nav-bar.module';
import { NavigationModule } from './theme/navigation/navigation.module';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [RouterModule, BreadcrumbComponent, NavigationModule, CommonModule, NavBarModule],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {
  
 // public props
 navCollapsed!: boolean;
//  navCollapsedMob: boolean;
 navCollapsedMob= signal<boolean>(false);
 windowWidth: number;

 // constructor
 constructor() {
   this.windowWidth = window.innerWidth;
   this.navCollapsedMob.update(()=>false);
  //  this.navCollapsedMob = false;
 }

 @HostListener('window:resize', ['$event'])
 // eslint-disable-next-line
 onResize(event: any): void {
   this.windowWidth = event.target.innerWidth;
   if (this.windowWidth < 992) {
     document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
     if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
       document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
     }
   }
 }

 // public method
 navMobClick() {
   if (this.windowWidth < 992) {
     if (this.navCollapsedMob() && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
       this.navCollapsedMob.update(()=> !this.navCollapsedMob());
      //  this.navCollapsedMob = !this.navCollapsedMob;
       setTimeout(() => {
         this.navCollapsedMob.update(()=> !this.navCollapsedMob());
        //  this.navCollapsedMob = !this.navCollapsedMob;
       }, 100);
     } else {
       this.navCollapsedMob.update(()=> !this.navCollapsedMob());
      //  this.navCollapsedMob = !this.navCollapsedMob;
     }
   }
 }

 handleKeyDown(event: KeyboardEvent): void {
   if (event.key === 'Escape') {
     this.closeMenu();
   }
 }

 closeMenu() {
   if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
     document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
   }
 }

}
