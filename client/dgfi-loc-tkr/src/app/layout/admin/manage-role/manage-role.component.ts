import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { CommonService } from '../../../softcafe/service/common.service';
import { AppPermission, PermissioinStoreService } from '../../../softcafe/service/permissioin-store.service';
import { Service } from '../../../softcafe/service/service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-manage-role',
  imports: [DragDropModule, NgIf, NgFor],
  templateUrl: './manage-role.component.html',
  styleUrl: './manage-role.component.scss'
})
export class ManageRoleComponent extends Softcafe implements OnInit, Service, OnDestroy {

  @Input() user!: any;

  manageRoleBtnDisabled = false;
  spinnerManage = false
  public appPermission = AppPermission;
  filteredUnassignRoleList = signal<any[]>([]);
  assignRoleList = signal<any[]>([]);
  // assignRoleList: any;
  unassignRoleList: any;
  loginName

  constructor(
    private cs: CommonService,
    private us: UserService,
    public permissioinStoreService: PermissioinStoreService,
    private location: Location
  ) {
    super();
    this.user = this.us.getCurrentUser();
  }

  showSameUserBtn = false
  ngOnInit() {
    if (!this.user.userId) {
      this.location.back();
    }
    const payload ={
     userId: this.user.userId
    } 
    this.loginName = this.user.loginName;
    var user = this.cs.isSameUser(payload.userId);
    debugger
    if (!user) {
      this.showSameUserBtn = true
    }

    this.cs.sendRequestAdmin(this, ActionType.SELECT_SINGLE_WITH_ROLE, ContentType.User, 'SELECT_SINGLE_WITH_ROLE', payload);
  }


  ngOnDestroy() {
    this.us.changeCurrentUser({});
  }

  onRoleSearch(e, ref: 'ASSIGN' | 'AVAILABLE') {
    console.log(e)
    if (ref == 'AVAILABLE') {
      this.filterAvailableRole(e);
    } else if (ref == 'ASSIGN') {
      // this.filterAssignRole(e);
    }

    return;
    // this.filteredUnassignRoleList.set(this.filteredUnassignRoleList().filter(x => this.assignRoleList().every(y => y.roleId != x.roleId)));
  }
  // filterAssignRole(e: any) {
  //   if (!e.target.value) {
  //     this.assignRoleList.update(()=>this.allAssignRoleList);
  //   }
  //   else {
  //     this.assignRoleList.update(()=>this.allAssignRoleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1));
  //   }
  // }
  filterAvailableRole(e: any) {
    if (!e.target.value) {
      this.filteredUnassignRoleList.update(() => this.unassignRoleList);
    }
    else {
      this.filteredUnassignRoleList.update(() => this.unassignRoleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1));
    }
  }

  manageRoleBtnClick() {
    debugger
    if (this.spinnerManage) {
      return
    }
    this.user.roleList = this.assignRoleList();
    this.user.unassignRoleList = this.unassignRoleList.filter(u => !this.assignRoleList().some(s => s.roleId === u.roleId));
    var payload = this.user;
    this.cs.sendRequestAdmin(this, ActionType.MANAGE_ROLE, ContentType.User, 'MANAGE_ROLE', payload);
    this.spinnerManage = true
    this.manageRoleBtnDisabled = true;
  }

  onApprove(role) {
    debugger
    this.user.roleList = [];
    this.user.roleList.push(role);
    var payload = this.user;
    
    this.cs.sendRequestAdmin(this, ActionType.APPROVE_ROLE, ContentType.User, 'APPROVE_ROLE', payload);
  }

  onApproveDeassign(role) {
    debugger
    this.user.roleList = [];
    this.user.roleList.push(role);
    var payload = this.user;
    
    this.cs.sendRequestAdmin(this, ActionType.APPROVE_DEASSIGN, ContentType.User, 'APPROVE_DEASSIGN', payload);
  }



  // onApproveDeassign(role) {
  //   const payload = {
  //     ...this.user,
  //     roleList: [role]
  //   };
    
  //   this.cs.sendRequestAdmin(
  //     this, ActionType.APPROVE_DEASSIGN,ContentType.User, 'APPROVE_DEASSIGN',payload);
  // }
  
  onUndoAssignDeAssign(role) {
    // Working
    debugger
    if (role.genericMapStatus == "PEND_ASSIGN") {
      this.onApproveDeassign(role);
    }else if (role.genericMapStatus == "PEND_DEASSINED") {
      this.onApprove(role);
    }
  }

  backBtnClick() {
    // this.router.navigate(["/admin"]);
    this.location.back();
  }

  drop(event: CdkDragDrop<string[]>) {

    debugger

    if (!this.permissioinStoreService.hasAnyPermission([AppPermission.USER_MAKER])) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  setValues() {
    this.assignRoleList.set(this.user.roleList);
    this.unassignRoleList = this.user.unassignRoleList;
    this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
    this.filteredUnassignRoleList.set(this.unassignRoleList);
  }

  onResponse(service: Service, req: any, response: any) {
    debugger
    console.log('success');
    this.spinnerManage = false
    if (response.header.referance == 'SELECT_SINGLE_WITH_ROLE') {
      if (response.payload.length > 0) {
        this.user = response.payload[0];
        this.setValues();
      }
      console.log(this.assignRoleList())
    }
    else if (response.header.referance == 'MANAGE_ROLE') {
      if (response.payload.length > 0) {
        this.manageRoleBtnDisabled = false;
        Swal.fire({ title: "রোল সফলভাবে নিয়ন্ত্রিত হয়েছে", toast: true, timer: 1000 ,confirmButtonText: "ঠিক আছে"});
        this.user = response.payload[0];
        this.setValues();
      }
    } else if (response.header.referance == 'APPROVE_ROLE') {
      if (response.payload.length > 0) {
        Swal.fire({ title: "রোল সফলভাবে অনুমোদিত হয়েছে", toast: true, timer: 1000 ,confirmButtonText: "ঠিক আছে"});
        this.user = response.payload[0];
        this.setValues();
      }
    } else if (response.header.referance == 'APPROVE_DEASSIGN') {           //problem hear
      if (response.payload.length > 0) {
        Swal.fire({ title: "ভূমিকা সফলভাবে বাতিল করা হয়েছে", toast: true, timer: 1000 ,confirmButtonText: "ঠিক আছে"});
        this.user = response.payload[0];
        this.setValues();
      }
    } else if (response.header.referance == 'UNDO_ASSIGN_DEASSIGN') {
      if (response.payload.length > 0) {
        Swal.fire({ title: "রোল সফলভাবে পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে", toast: true, timer: 1000 ,confirmButtonText: "ঠিক আছে"});
        this.user = response.payload[0];
        this.setValues();
      }
    }

  }

  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
