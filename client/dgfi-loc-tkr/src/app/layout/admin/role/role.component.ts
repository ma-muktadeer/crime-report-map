import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-role',
  imports: [DragDropModule, ReactiveFormsModule, NgStyle, NgClass],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent extends Softcafe implements OnInit, Service, AfterViewInit {
  spinnerSave = false
  spinnerAddSave = false
  roleBtnDisabled = false
  roleBtnAddDisabled = false
  permissionList = [];
  filteredPermissionList = [];
  roleList = [];
  filtedRoleList = signal<any[]>([]);
  displayStyle = "none";
  buttonSaveOrUpdate;
  displayName = [];
  desc = []
  clickedItem = null;
  roleId
  unassignRoleList: any;
  assignRoleList: any;
  unassignPermissionList = signal<any[]>([]);
  assignPermissionList = signal<any[]>([]);
  // assignPermissionList: any;
  roleForm: FormGroup;

  showRoleGroupAssignSave = false;



  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cs: CommonService,
    public userService: UserService,
    private cdf: ChangeDetectorRef,
    public permissioinStoreService: PermissioinStoreService) {
    super();
    this.initRoleGroupForm();
  }

  ngOnInit(): void {
    // this.showRoleGroupAssignSave = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.SAVE_USER)
    this.onLoad();
    this.onLoadPermissionsList();
  }
  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  initRoleGroupForm() {
    this.roleForm = this.fb.group({
      displayName: ['', [Validators.required]],
      roleId: [null],
      desc: [null]
    })
  }



  onAddRole() {
    this.roleForm.reset();
    this.roleId = null
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "সংরক্ষণ"
  }

  onDelete(e, group) {
    debugger
    e.stopPropagation();

    Swal.fire({
      text: 'Submit for deletion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var payload = {
          roleId: group.roleId
        }
        return this.cs.sendRequestAdmin(this, ActionType.DELETE, ContentType.Role, 'DELETE', payload)
      }
    });

  }

  onClickGroupItem(e, group) {
    debugger
    this.clickedItem = group;
    console.log(this.clickedItem)
    this.cs.sendRequestAdmin(this, ActionType.SELECT_ROLE_WITH_PERMISSION, ContentType.Role, 'SELECT_ROLE_WITH_PERMISSION', group)
  }
  getItemBackgroupColor(group) { }

  onEdit(e, role) {
    debugger
    e.stopPropagation();
    this.roleId = role.roleId
    this.displayName = role.displayName
    this.desc = role.desc

    this.roleForm.reset()

    var pt = {
      roleId: role.roleId,
      displayName: role.displayName,
      desc: role.desc
    }

    this.roleForm.patchValue(pt);
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "আপডেট করুন"
  }

  onSave() {
    debugger
    if (this.spinnerAddSave) {
      return
    }
    var payload = this.roleForm.value
    payload.roleId = this.roleId
    this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.Role, 'SAVE', payload);
    this.spinnerAddSave = true
    this.roleBtnAddDisabled = true
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;

  }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.Role, 'FindAll', {});
  }

  onLoadPermissionsList() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.AppPermission, 'FindAllPermission', {});
  }

  allowApprove(group) {
    return this.hasRole(this.userService.userAdminChekerRoles) && group.status != 'APPROVED' && group.creatorId != this.cs.getUserId()
  }



  closePopup() {
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;
    this.displayName = null;
    this.desc = null;
    this.roleForm.reset();
    this.roleId = null;
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
  onApprove(e, group) {
    e.stopPropagation();
    this.cs.sendRequestAdmin(this, ActionType.APPROVE, ContentType.Role, "Approved", group);
  }

  unassignPermissionListAll = []
  onSearchPermission(e, terget) {
    console.log(e)
    if (terget == 'UN') {
      if (!e.target.value) {
        this.unassignPermissionList.update(()=>this.unassignPermissionListAll);
        // this.unassignPermissionList = this.unassignPermissionListAll
      }
      else {
        // this.unassignPermissionList = this.unassignPermissionListAll.filter(x => 
        this.unassignPermissionList.update(()=>this.unassignPermissionListAll.filter(x =>
          x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1 ||
          x.permissionName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1

        ));
      }
    }

    this.unassignPermissionList.update(()=>this.unassignPermissionList().filter(x => this.assignPermissionList().every(y => y.permissionId != x.permissionId)));
    // this.unassignPermissionList = this.unassignPermissionList.filter(x => this.assignPermissionList.every(y => y.permissionId != x.permissionId))

  }


  onSaveRoleManage() {
    debugger
    if (this.spinnerSave) {
      return;
    }
    var payload = {
      permissionList: this.assignPermissionList(),
      unassignedPermissionList: this.unassignPermissionList(),
      roleId: this.clickedItem.roleId

    }

    this.cs.sendRequestAdmin(this, ActionType.MANAGE_ROLE_PERMISSION, ContentType.Role, 'MANAGE_ROLE_GROUP', payload);
    this.spinnerSave = true
    this.roleBtnDisabled = true
  }
  onRoleSearch(e) {
    console.log(e)
    if (!e.target.value) {
      // this.filtedRoleList = this.roleList
      this.filtedRoleList.set(this.roleList);
    }
    else {
      this.filtedRoleList.set(this.roleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1));
      // this.filtedRoleList = this.roleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1)
    }


  }
  user
  onApprovePermission(permission) {
    debugger

    var role = this.clickedItem

    role['appPermissionList'] = [permission]
    this.cs.sendRequestAdmin(this, ActionType.APPROVE_PERMISSION, ContentType.Role, 'APPROVE_PERMISSION', role);
  }

  onApproveDeassign(permission) {
    debugger
    var role = this.clickedItem

    role['appPermissionList'] = [permission]
    this.cs.sendRequestAdmin(this, ActionType.APPROVE_DEASSIGN_PERMISSION, ContentType.Role, 'APPROVE_DEASSIGN_PERMISSION', role);
  }

  onUndoAssignDeAssign(role) {
    debugger
    // Working
    if (role.genericMapStatus == "PEND_ASSIGN") {
      this.onApproveDeassign(role);
    } else if (role.genericMapStatus == "PEND_DEASSINED") {
      this.onApprovePermission(role);
    }
  }

  onResponse(service: Service, req: any, res: any) {
    this.spinnerSave = false
    this.spinnerAddSave = false
    this.roleBtnAddDisabled = false
    this.roleBtnDisabled = false

    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }

    debugger
    if (res.header.referance == 'FindAll') {
      this.roleList = res.payload
      this.filtedRoleList.set(res.payload);
      console.log(res);
    }
    else if (res.header.referance == 'SAVE') {
      Toast.show("রোল সফলভাবে সংরক্ষিত হয়েছে");
      this.onLoad();
    }
    else if (res.header.referance == 'Approved') {
      Toast.show("রোল অনুমোদন হয়েছে");
      this.onLoad();
    }
    else if (res.header.referance == 'DELETE') {
      Toast.show("সফলভাবে মুছে ফেলা হয়েছে");
      this.onLoad();
    }
    else if (res.header.referance == 'SELECT_ROLE_WITH_PERMISSION') {
      console.log(res);

      var role = res.payload
      this.assignPermissionList.update(()=>role.permissionList);
      // this.assignPermissionList = role.permissionList;
      // this.unassignPermissionList = role.unassignedPermissionList;
      this.unassignPermissionList.update(()=>role.unassignedPermissionList);
      this.unassignPermissionListAll = role.unassignedPermissionList;

    }

    else if (res.header.referance == 'MANAGE_ROLE_GROUP') {
      console.log(res)
      var role = res.payload
      this.assignPermissionList.update(()=>role.permissionList);
      // this.assignPermissionList = role.permissionList;
      this.unassignPermissionList.update(()=>role.unassignedPermissionList);
      // this.unassignPermissionList = role.unassignedPermissionList;
      this.unassignPermissionListAll = role.unassignedPermissionList;
      Toast.show("Role Saved");
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'APPROVE_DEASSIGN_PERMISSION') {
      Swal.fire({ title: "Successfully De-Assigned Permission", toast: true, timer: 1000 });
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'APPROVE_PERMISSION') {
      Swal.fire({ title: "Successfully Approve Permission ", toast: true, timer: 1000 });
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'FindAllPermission') {
      console.log(res);
      this.permissionList = res.payload
      this.filteredPermissionList = res.payload
      console.log(this.permissionList);
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
