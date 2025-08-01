import { Injectable } from "@angular/core";
import { AppRole } from "../common/AppRole";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class PermissioinStoreService {

  permissionList = []

  public appPermission = AppPermission


  constructor(private cs: CommonService) {
    if (sessionStorage.getItem('APP_LOGIN_USER')) {
      this.getPermission();
    }
  }

  private getPermission() {
    const usr = JSON.parse(sessionStorage.getItem('APP_LOGIN_USER'));
    this.permissionList = usr?.permissionList ?? [];
    console.log(this.permissionList)
  }

  loadPermission() {
    if (this.permissionList.length > 0) {
      return;
    }
    this.getPermission();

  }

  hasPermission(permissioin: AppPermission): boolean {

    if (this.cs.forceAllow()) {
      return true;
    }
    if (this.permissionList.length < 1) {
      this.getPermission();
    }
    return this.permissionList.some(f => f.permissionName == permissioin);
  }

  hasAnyPermission(permissioin: Array<AppPermission>) {

    if (this.cs.forceAllow() || !permissioin) {
      return true;
    }

    var allow = false;

    permissioin.forEach(p => {
      var success = this.hasPermission(p)
      if (success) {
        allow = true;
        return allow;
      }
      return false
    })

    return allow;
  }

  isBranchMaker() {
    return this.cs.hasAnyRole([AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER, AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER])
  }


}












export enum AppPermission {
  SAVE_DEPARTMENT = "SAVE_DEPARTMENT",
  DELETE_DEPARTMENT = "DELETE_DEPARTMENT",
  APPROVE_DEPARTMENT = "APPROVE_DEPARTMENT",
  VIEW_DEPARTMENT = "VIEW_DEPARTMENT",
  PASSWORD_ADMIN = "PASSWORD_ADMIN",
  VIEW_EMAIL_REPORT = "VIEW_EMAIL_REPORT",
  APPLICATION_SETUP_MAKER = "APPLICATION_SETUP_MAKER",
  APPLICATION_SETUP_CHECKER = "APPLICATION_SETUP_CHECKER",
  ACCESS_APPLICATION_SETUP = "ACCESS_APPLICATION_SETUP",





  //dgfi=============================
  DASHBOARD_VIWER = 'DASHBOARD_VIWER',
  USER_MAKER = "USER_MAKER",
  VIEW_PERMISSION = "VIEW_PERMISSION",
  VIEW_ROLE = "VIEW_ROLE",
  USER_VIEWER = "USER_VIEWER",
  DGFI_MAKER = "DGFI_MAKER",
  DGFI_VIEWER = "DGFI_VIEWER",
  DGFI_ECONOMIC = "DGFI_ECONOMIC",
  TIMELY_REPORT_VIEWER = "TIMELY_REPORT_VIEWER",
  INTERVAL_REPORT_VIEWER = "INTERVAL_REPORT_VIEWER",
  COMPARE_REPORT_VIEWER = "COMPARE_REPORT_VIEWER",
  MAP_REPORT_VIEWER = "MAP_REPORT_VIEWER",
  ECONOMIC_REPORT_VIEWER = "ECONOMIC_REPORT_VIEWER",
  SAVE_PERMISSION = "SAVE_PERMISSION",
  SAVE_ROLE = "SAVE_ROLE",
  USER_APPROVER = "USER_APPROVER",
  DELETE_USER = "DELETE_USER",
  APPROVE_PERMISSION = "APPROVE_PERMISSION",
  MAKE_ROLE = "MAKE_ROLE",
  APPROVE_ROLE = "APPROVE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  TABULAR_REPORT_VIEWER = "TABULAR_REPORT_VIEWER",
  ADD_SEAT = "ADD_SEAT"
}