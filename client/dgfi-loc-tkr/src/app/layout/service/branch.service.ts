import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ActionType } from "../../softcafe/constants/action-type.enum";
import { ContentType } from "../../softcafe/constants/content-type.enum";
import { CommonService } from "../../softcafe/service/common.service";
import { Service } from "../../softcafe/service/service";
@Injectable({
    providedIn: 'root'
  })
  export class BranchService implements Service {
  
  
    branchLoadChanged: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  
    branchList = [];
    constructor(private cs : CommonService) { 
  
    }
  
    loadnBranch(){
      var payload1 = {};
      if(this.branchList.length){
        return;
      }
      this.cs.sendRequestPublic(this, ActionType.SELECT, ContentType.Branch, "BRUNCH_LIST_DROP_DOWN", payload1);
      // this.cs.sendRequestPublic(this, ActionType.BRUNCH_LIST, ContentType.DataConfig, "BRUNCH_LIST_DROP_DOWN", payload1);
  
    }
  
    loadBranchAsync(){
      // return this.cs.executePublic(ActionType.BRUNCH_LIST, ContentType.DataConfig, {});
      return this.cs.executePublic(ActionType.SELECT, ContentType.Branch, {});
    }
  
  
  
    getBranchName(id){
      var item = this.branchList.find( i => i.branchId == id);
      if(!item){
        return '';
      }
      return item.brunchName;
    }
  
  
    isHeadOfficeUser(){
      var item = this.branchList.find( i => i.brunchName == 'HEAD OFFICE');
      var loginUser = this.cs.loadLoginUser();
      if(!item){
        return false;
      }
      if(item.branchId == loginUser.branchId){
        return true;
      }
      return false;
    }
  
    onResponse(service : Service, req : any, response: any) {
      
      console.log(response.payload)
      if (response.header.referance == 'BRUNCH_LIST_DROP_DOWN') {
        this.branchList = response.payload;
        this.branchLoadChanged.next(this.branchList);
      }
    }
    onError(service : Service , req : any, response: any) {
      console.log('error');
    }
  }
  