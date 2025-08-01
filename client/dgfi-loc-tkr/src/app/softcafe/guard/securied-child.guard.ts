import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { InjectPermissionService } from '../service/inject-permission.service';

export const securiedChildGuard: CanActivateChildFn = (childRoute, state) => {
  const injectPermission = inject(InjectPermissionService);
  const router = inject(Router);
  
  if (injectPermission.isAuthUrl(state.url)) {
    return true; // Or add your custom logic
  }
  //need to navigate 
  router.navigate(['/page-not-found']);
  return false;
};
