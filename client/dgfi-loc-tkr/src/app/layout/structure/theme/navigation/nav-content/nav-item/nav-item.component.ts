// Angular Import
import { Component, inject, Input } from '@angular/core';

// project import
import { InjectPermissionService } from '../../../../../../softcafe/service/inject-permission.service';
import { AppPermission } from '../../../../../../softcafe/service/permissioin-store.service';
import { NavigationItem } from '../../navigation';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  standalone: false,
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  // public props
  @Input() item!: NavigationItem;
  private injectPermission = inject(InjectPermissionService);

  // public method
  closeOtherMenu(event: MouseEvent, appPermission: AppPermission[] | 'DEFAULT') {
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.pcoded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('pcoded-trigger');
      }

      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
    if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
    this.injectPermission.urlPermission = appPermission;
    this.injectPermission.isNabBar = true;
  }
}
