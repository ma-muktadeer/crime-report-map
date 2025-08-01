import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { Toast } from '../../../softcafe/common/Toast';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { CommonService } from '../../../softcafe/service/common.service';
import { PermissioinStoreService } from '../../../softcafe/service/permissioin-store.service';
import { Service } from '../../../softcafe/service/service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [DragDropModule, FormsModule, CommonModule],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent extends Softcafe implements OnInit, Service {

  permissionList = [];
  filteredPermissionList = signal<any[]>([]);
  displayStyle = "none";
  buttonSaveOrUpdate;
  roleGroupName = [];
  clickedItem = null;
  roleGroupId
  unassignRoleList = signal<any[]>([]);;
  assignRoleList: any;
  roleGroupForm: FormGroup;
  displayName
  desc
  permissionId
  disableAddSave = false
  spinnerAddSave = false
  spinnerAssignSave = false
  permissionBtnDisabled = false
  user: any;
  showRoleGroupAssignSave = false;


  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cs: CommonService,
    public userService: UserService,
    public permissioinStoreService: PermissioinStoreService) {
    super();
    this.initRoleGroupForm();
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    var payload = this.user;
    // if(this.permissioinStoreService.hasPermission(AppPermission.APPROVE_PERMISSION)){
    //   this.showRoleGroupAssignSave = true
    // }
    this.onLoad();
  }

  initRoleGroupForm() {
    this.roleGroupForm = this.fb.group({
      roleGroupName: [null, Validators.required],
    })
  }

  onEdit(e, group) {
    debugger
    this.permissionId = group.permissionId
    this.displayName = group.displayName
    this.desc = group.desc
    e.stopPropagation();
    this.displayStyle = "block"
  }


  unassignPermissionListAll = []
  onSearchPermission(e, terget) {
    debugger
    console.log(e)
    if (terget == 'UN') {
      if (!e.target.value) {
        // this.unassignRoleList = this.unassignPermissionListAll
        this.unassignRoleList.set(this.unassignPermissionListAll);
      }
      else {
        // this.unassignRoleList = this.unassignPermissionListAll.filter(x =>
        this.unassignRoleList.set(this.unassignPermissionListAll.filter(x =>
          x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1
        ));
      }
    }
  }

  onSave() {
    if (this.spinnerAddSave) {
      return
    }
    var payload = {
      permissionId: this.permissionId,
      displayName: this.displayName,
      desc: this.desc
    }
    this.displayStyle = "none"
    this.spinnerAddSave = true
    this.disableAddSave = true
    return this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.AppPermission, 'SAVE', payload)

  }



  onAddRoleGroup() {
    this.roleGroupForm.reset();
    this.roleGroupId = null
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Save"
  }

  onClickPermissionItem(e, group) {

    debugger
    this.clickedItem = group;
    return this.cs.sendRequestAdmin(this, ActionType.SELECT_PERMISSION_ROLE, ContentType.AppPermission, 'SELECT_PERMISSION_ROLE', group)
  }
  getItemBackgroupColor(group) { }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.AppPermission, 'FindAll', {});
  }


  closePopup() {
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;
    this.roleGroupName = null;
    this.roleGroupForm.reset();
    this.roleGroupId = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  onRoleSave() {
    debugger
    if (this.spinnerAssignSave) {
      return;
    }
    var payload = {
      roleList: this.assignRoleList,
      unassignRoleList: this.unassignRoleList(),
      permissionId: this.clickedItem.permissionId

    }

    this.cs.sendRequestAdmin(this, ActionType.MANAGE_APP_PERMISSION, ContentType.AppPermission, 'MANAGE_APP_PERMISSION', payload);
    this.spinnerAssignSave = true
    this.permissionBtnDisabled = true
  }

  onPermissionSearch(e) {
    console.log(e)
    if (!e.target.value) {
      // this.filteredPermissionList = this.permissionList
      this.filteredPermissionList.set(this.permissionList);
    }
    else {
      // this.filteredPermissionList = this.permissionList.filter(x => x.permissionName.indexOf(e.target.value.toUpperCase()) > -1)
      this.filteredPermissionList.set(this.permissionList.filter(x => x.permissionName.indexOf(e.target.value.toUpperCase()) > -1));
    }
  }

  onResponse(service: Service, req: any, res: any) {
    this.spinnerAddSave = false
    this.disableAddSave = false
    this.spinnerAssignSave = false
    this.permissionBtnDisabled = false
    debugger
    if (res.header.referance == 'FindAll') {
      this.permissionList = res.payload
      // this.filteredPermissionList = res.payload
      this.filteredPermissionList.set(res.payload);
      console.log(res);
    }
    else if (res.header.referance == 'SAVE') {
      Toast.show("Permission Saved");
      this.onLoad();
    }
    else if (res.header.referance == 'APPROVE') {
      Toast.show("Permission Approved");
      this.onLoad();
    }
    else if (res.header.referance == 'SELECT_PERMISSION_ROLE') {
      console.log(res);

      var roleGroup = res.payload
      this.assignRoleList = roleGroup.roleList;
      this.unassignRoleList.set(roleGroup.unassignRoleList);
      // this.unassignRoleList = roleGroup.unassignRoleList;
      this.unassignPermissionListAll = roleGroup.unassignRoleList;

    } else if (res.header.referance == 'APPROVE_PERMISSION') {
      if (res.payload.length > 0) {
        Swal.fire({ title: "Successfully APPROVE PERMISSION", toast: true, timer: 1000 });
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        this.unassignRoleList.set(this.user.unassignRoleList);
        // this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList.set(this.unassignRoleList().filter(x => x.status == 'APPROVED'));
        // this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        // this.filteredUnassignRoleList = this.unassignRoleList 
      }
    } else if (res.header.referance == 'APPROVE_DEASSIGN_PERMISSION') {
      if (res.payload.length > 0) {
        Swal.fire({ title: "Successfully De-Assigned Role", toast: true, timer: 1000 });
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        this.unassignRoleList.set(this.user.unassignRoleList);
        // this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList.set(this.unassignRoleList().filter(x => x.status == 'APPROVED'));
        // this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        // this.filteredUnassignRoleList = this.unassignRoleList 
      }
    }

    else if (res.header.referance == 'MANAGE_APP_PERMISSION') {
      console.log(res)
      Toast.show("Permission Saved");
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log(res);
    throw new Error('Method not implemented.');
  }

  hasRole(role) {
    return this.cs.hasAnyRole(role);
  }

}
