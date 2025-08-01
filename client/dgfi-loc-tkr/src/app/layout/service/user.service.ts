import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AppRole } from "../../softcafe/common/AppRole";
import { ActionType } from "../../softcafe/constants/action-type.enum";
import { ContentType } from "../../softcafe/constants/content-type.enum";
import { CommonService } from "../../softcafe/service/common.service";

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
  
    isView = false;
    addUser: boolean = true;
    private userSource = new BehaviorSubject<any>({});
  
    selectedUser = this.userSource.asObservable();
  
    
    userAdminMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_MAKER];
    userAdminChekerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_CHECKER];
    userAdminViewerRoles = [AppRole.SUPER_ADMIN,  AppRole.USER_ADMINISTRATION_VIEWER];
  
  
    constructor(private http : HttpClient, private cs : CommonService) { 
  
    }
  
    changeCurrentUser(user){
      debugger
      user.allowLogin  = user.allowLogin == "Yes" ? 1 : 0
      this.userSource.next(user);
      this.userSource.complete();
    }
  
    getCurrentUser() {
      var value = this.userSource.value;
      return value;
    }
  
    getAllUser(){
      var req = this.cs.generateReqJson(ActionType.SELECT, ContentType.User, 'selectAlluser', {});
    }
  }
  