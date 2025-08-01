import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonService } from '../service/common.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private cs : CommonService) {}

    canActivate() {
        
        var loginUser = this.cs.loadLoginUser();
        if (loginUser?.userId) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
