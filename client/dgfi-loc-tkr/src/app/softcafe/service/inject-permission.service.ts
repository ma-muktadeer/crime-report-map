import { Injectable, Input } from '@angular/core';
import { NabItemsService } from '../../layout/structure/theme/navigation/nab-items.service';
import { NavigationItems } from '../../layout/structure/theme/navigation/navigation';
import { AppPermission, PermissioinStoreService } from './permissioin-store.service';

@Injectable({
  providedIn: 'root'
})
export class InjectPermissionService {

  @Input()
  public urlPermission: AppPermission[] | 'DEFAULT';

  @Input()
  public isNabBar: boolean = false;


  constructor(private permissionService: PermissioinStoreService, private nabItemService: NabItemsService) { }

  getUrlPermission() {
    return this.urlPermission;
  }

  isAuthUrl(url: string): boolean {
    if(this.urlPermission && this.urlPermission == 'DEFAULT'){
      return true;
    }
    if (!this.urlPermission && !this.isNabBar) {
      const items = this.nabItemService.findNabItems(NavigationItems, url);
      this.urlPermission = items && items.length ? items[0].permission : null;
    }
    if (this.urlPermission == null) {
      return false;
    }

    return Array.isArray(this.urlPermission) ?
     this.permissionService.hasAnyPermission(this.urlPermission) : true;
  }

}
