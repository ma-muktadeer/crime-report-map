import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, MenuCommandItem, Pagination, PaginationService } from 'angular-slickgrid';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { CommonService } from '../../../softcafe/service/common.service';
import { AppPermission, PermissioinStoreService } from '../../../softcafe/service/permissioin-store.service';
import { Service } from '../../../softcafe/service/service';
import { SoftGridModule } from "../../common/soft-grid/soft-grid.module";
import { SoftLoadingComponent } from '../../common/soft-loading/soft-loading.component';
import { CustomGridData } from '../../service/CustomGridData';
import { UserService } from '../../service/user.service';
import { ProfileComponent } from '../user/profile/profile.component';

@Component({
  selector: 'app-user-list',
  imports: [SoftLoadingComponent, CommonModule, SoftGridModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export default class UserListComponent extends Softcafe implements OnInit, Service, AfterViewInit, OnDestroy, AfterContentChecked {

  updateDialog: NgbModalRef | null = null;  //export NgbModalRef for popup


  actionColumnWidth = 10;

  showGrid = false;
  public paginationService: PaginationService;

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset = signal<CustomGridData>(null);
  // dataset: Observable<CustomGridData> = of();
  angularGrid: AngularGridInstance;
  gridObj;

  // dataViewObj;

  @ViewChild("btnUserDelete", { read: ElementRef }) btnUserDelete: ElementRef;

  columns: Array<any>;
  manageRoleBtnDisabled: boolean;
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number;
  callPagination: boolean = false;
  totalPages: any;
  // paginationService: any;
  ;
  updateUserBtnDisabled: boolean;
  public appPermission = AppPermission

  userList: Array<any> = [];

  selectedUserList: Array<any>;
  selectedUser: any;
  contextMenuUser: any;
  loading = signal<boolean>(false);

  dataViewObj: import("angular-slickgrid").SlickDataView<any>;

  constructor(private router: Router,
    private cs: CommonService,
    private userService: UserService,
    public permissioinStoreService: PermissioinStoreService,
    private modalService: NgbModal  //constractor for popup


    // private cdf: ChangeDetectorRef

  ) {
    super();
    this.prepareGrid();
  }

  ngOnInit() {
    this.userService.isView = false;
    this.manageRoleBtnDisabled = true;
    this.updateUserBtnDisabled = true;
    // this.gridOptions = this.buildGridOptions()
    this.loadUser();
    // this.getWindowSize();
  }

  ngOnDestroy(): void {
    // this.angularGrid.destroy;
  }

  // mehod for popup
  openProfile(viewOpt?: { isUpdate: boolean, isViewMode: boolean, currentUser: any }) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: true
    };
    this.updateDialog = this.modalService.open(ProfileComponent, modalOptions);
    this.updateDialog.componentInstance.isPopup = true;
    this.updateDialog.componentInstance.currentUser = viewOpt?.currentUser;
    this.updateDialog.componentInstance.isViewMode = viewOpt?.isViewMode ?? false;
    this.updateDialog.componentInstance.isUpdate = viewOpt?.isUpdate ?? false;
    this.updateDialog.result.then(
      (res: any) => {
        if (res && typeof res != 'string') {
          this.userList = res.content;
          this.total = res.totalElements;
          this.buildUserDataset();
          // this.loadUser({
          //   pageNumber: this.pageNumber,
          //   pageSize: this.pageSize
          // });
        }
      }
    )
  }

  loadUser(pagination?: Pagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    var payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
    };
    this.loading.set(true);

    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.User, 'select', payload);
  }

  ngAfterViewInit(): void {
    // this.showGrid = true;
    // this.cdf.detectChanges();
  }

  ngAfterContentChecked(): void {
    // this.cdf.detectChanges();
  }

  paginationChanged(event: any) {
    debugger
    if (this.callPagination) {
      return;
    }
    this.callPagination = true;
    console.log('pagenation ', event);
    this.loadUser(event as Pagination);
  }

  onContextMenuAction(event, actionItem) {

  }
  onNewUser() {
    this.router.navigate(['/admin/profile']);
  }

  onItemDblClick(item) {
    this.router.navigate(['/user/profile']);
    this.userService.changeCurrentUser(item);
  }

  onEditUser(e, args) {
    var item = args.dataContext;
    item.allowLogin = item?.allowLogin == 'Yes' ? 1 : 0;
    this.userService.changeCurrentUser(item);
    // this.router.navigate(['/user/profile']);
    this.openProfile({ isUpdate: true, isViewMode: false, currentUser: item });
  }

  onViewUser(e, args) {
    const item = args.dataContext;
    item.allowLogin = item?.allowLogin == 'Yes' ? 1 : 0;
    this.userService.changeCurrentUser(item);
    // this.router.navigate(['/user/profile']);
    this.openProfile({ isUpdate: false, isViewMode: true, currentUser: item });
  }

  // toggleActivation(e, arge) {

  //   console.log(arge.dataContext.allowLogin);
  //   var payload = arge.dataContext;
  //   payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
  //   debugger
  //   this.loading = true;

  //   this.cs.sendRequestAdmin(this, ActionType.TOGGLE_ACTIVATION, ContentType.User, 'activeToggleUser', payload);

  // }
  changeUserPassword(e, arge) {

    console.log(arge.dataContext.allowLogin);
    var payload = arge.dataContext;
    payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
    debugger
    this.loading.set(true);


    this.cs.sendRequestAdmin(this, ActionType.RESET_PASSWORD, ContentType.User, 'RESET_PASSWORD', payload);

  }

  selectUserWithButton(data) {
    this.selectedUser = data;
  }

  manageRole(e, args) {
    var item = args.dataContext;
    this.manageUserRole(item);
  }

  manageUserRole(user) {
    this.userService.changeCurrentUser(user);
    this.router.navigate(['/admin/manage-role']);
  }

  approveUser(e: any, args: any) {
    debugger
    console.log('selected user information :', args.dataContext);

    Swal.fire({
      title: "Do you want to approve?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let payload = JSON.parse(JSON.stringify(args.dataContext));
        payload.allowLogin = args.dataContext.allowLogin == 'No' ? 0 : 1;
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.loading.set(true);


        this.cs.sendRequest(this, ActionType.APPROVE, ContentType.User, 'select_app', payload);
      } else {
        Swal.fire({
          title: "Changes are not approved",
          icon: 'info',
          timer: 1500,
        });
      }
    });


  }
  submitUser(e: any, args: any) {
    debugger
    console.log('selected user information :', args.dataContext);

    Swal.fire({
      title: "Do you want to submit?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let payload = JSON.parse(JSON.stringify(args.dataContext));
        payload.allowLogin = args.dataContext.allowLogin == 'No' ? 0 : 1;
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.loading.set(true);


        this.cs.sendRequest(this, ActionType.SUBMIT, ContentType.User, 'select_app', payload);
      } else {
        Swal.fire({
          title: "Changes are not submit",
          icon: 'info',
          timer: 1500,
        });
      }
    });
  }

  onDelete(e, args) {
    debugger
    var userItem  = args.dataContext;

    Swal.fire({
      title: 'Are you sure want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const payload = {
          userId: userItem.userId,
          allowLogin: userItem.allowLogin == 'No' ? 1 : 0,
         // isActive: userItem.isActive === 1 ? 0 : userItem.isActive
        };
        this.loading.set(true);


        this.cs.sendRequestAdmin(this, ActionType.DELETE, ContentType.User, 'onDeleteBtnClick', payload);
      }
    });
  }

  updateItem(upItem) {
    upItem.allowLogin = upItem.allowLogin === 1 ? 'Yes' : 'No';
    // this.angularGrid.gridService.updateItem(upItem);
    // this.userList.forEach(u => { if (u.userId === upItem.userid) { u = upItem } });
    console.log('Updating item in grid:', upItem);

    debugger
    this.userList = this.userList.map(u =>
      u.userId === upItem.userId ? upItem : u
    );
    let dt = {
      content: this.userList,
      total: this.total,
      pageSize: this.pageSize,
      totalPages: this.totalPages
    };
    this.dataset.set(dt);
    // this.dataset = of(dt);
    if (this.angularGrid && this.angularGrid.dataView) {
      this.angularGrid.dataView.refresh();
    }
  }

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="দেখুন"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="ডিলিট"  style="font-size:14px;"  class="fa fa-trash pointer" aria-hidden="true"></i>'
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="সংশোধন"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>'
  };
  roleManage: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="রোল ব্যবস্থাপনা"  style="font-size:14px;"  class="fa fa-cogs pointer" aria-hidden="true"></i>'
  };
  approveBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasAnyPermission([AppPermission.USER_APPROVER])) {
      return '<button type="button" title="Approve" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else {
      return '';
    }
  };
  makerBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.makerAction.includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(AppPermission.USER_MAKER)) {
      return '<button type="button" class="btn-primary pointer"><i title="Submit" class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else {
      return '';
    }
  };

  makerAction: string[] = ['NEW', 'MODIFIED',]

  colDef: Column[] = [
    {
      id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon,
      minWidth: 20, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Delete User",
      onCellClick: (e, args) => { this.onDelete(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 20, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { this.onEditUser(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'view', name: '', field: 'view', formatter: this.viewIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { this.onViewUser(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'role', name: '', field: 'role', formatter: this.roleManage,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      toolTip: "Manage Role",
      cssClass: "manage-role-icon",
      onCellClick: (e, args) => { this.manageRole(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'submit', name: '', field: 'submit', formatter: this.makerBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      toolTip: "Submit User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        if (this.makerAction.includes(args.dataContext?.userStatus)) {
          this.submitUser(e, args);
        }
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'approve', name: '', field: 'approve', formatter: this.approveBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      toolTip: "Approve User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        if (args.dataContext?.userStatus === 'PEND_APPROVE') {
          this.approveUser(e, args);
        }
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'fullName', name: 'পুরো নাম', field: 'fullName',
      sortable: true, type: FieldType.text, minWidth: 130,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'email', name: 'ইমেইল ঠিকানা', field: 'email',
      sortable: true, type: FieldType.text, minWidth: 170,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'branch', name: 'শাখার নাম', field: 'branch',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },

    {
      id: 'loginName', name: 'লগইন নাম', field: 'loginName',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'userStatus', name: 'ব্যবহারকারীর অবস্থা', field: 'userStatus',
      sortable: true, type: FieldType.text, formatter: (row, cell, value, columnDef, dataContext, grid) => this.blockToCamel(dataContext?.userStatus),
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'allowLogin', name: 'লগইন অ্যাক্সেস', field: 'allowLogin',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'] },
      formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.allowLogin == 'Yes' ? "Yes" : "No" }
    }
  ];


  blockToCamel(value: string) {

    if (value && (value != null && value != 'null')) {
      try {
        const words = value.split(/_| /g);
        const camelCaseWords = words.map((word, index) => index < 0 ? word : word.charAt(0) + word.slice(1).toLowerCase());
        const sts = camelCaseWords.join(' ');
        return sts == 'In Active' ? 'Inactive' : sts;;
      } catch (error) {
        console.log('can not convert: ', value);
        return value;
      }
    } else {
      return '';
    }

  }

  prepareGrid() {

    if (this.cs.forceAllow()) {
      this.columnDefinitions = this.colDef;
    }
    else {
      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.DELETE_USER)) {
        this.colDef = this.colDef.filter(x => x.id != 'delete');
      }

      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_MAKER)) {
        this.colDef = this.colDef.filter(x => x.id != 'edit');
        this.colDef = this.colDef.filter(x => x.id != 'submit');
      }

      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_APPROVER)) {
        this.colDef = this.colDef.filter(x => x.id != 'view');
      }
    }

    this.columnDefinitions = this.colDef;

    // this.dataset = of(this.userList);
  }

  checkActiveRole(data) {
    return this.permissioinStoreService.hasAnyPermission([this.appPermission.USER_MAKER, this.appPermission.USER_APPROVER])
      && (this.cs.forceAllow() || data.creatorId != this.cs.getUserId());
  }
  checkUserActionVisibility(data) {
    return this.checkActiveRole(data)
      && (data?.userStatus === 'ACTIVE' || data?.userStatus === 'PEND_ACTIVE' || data?.userStatus === 'INACTIVE' || data?.userStatus === 'PEND_INACTIVE');
  }
  checkPasswordAdminRole(data) {
    return this.permissioinStoreService.hasPermission(this.appPermission.PASSWORD_ADMIN)
      && (this.cs.forceAllow() || data.creatorId != this.cs.getUserId());
  }
  checkPasswordAdminVisibility(data) {
    return this.checkPasswordAdminRole(data) && data.userType === 'External User';
  }


  contextMenu = {

    hideCloseButton: false,
    hideCopyCellValueCommand: true,
    commandItems: [
      {
        command: 'Active_Status',
        iconCssClass: 'fa fa-user',
        title: 'Active/Inactive user',
        // positionOrder: menuOrder++,
        action: (e, args) => { this.toggleActivation(e, args) },
        disabled: false,
        itemUsabilityOverride: (args) => {
          debugger
          console.log(args);
          args.grid.getOptions().contextMenu.commandItems.forEach(element => {
            if (element['command'] == 'Active_Status') {
              element['title'] = this.checkStatus(args.dataContext.userStatus, args.dataContext.allowLogin);
            }
          });
          return this.checkActiveRole(args.dataContext);
          // return true;
        },
        itemVisibilityOverride: (args) => {

          return this.checkUserActionVisibility(args.dataContext);
          // return true;
        }
      },
      {
        command: 'Password_Admin',
        iconCssClass: 'fa fa-key',
        title: 'Change Password',
        // positionOrder: menuOrder++,
        action: (e, args) => { this.changeUserPassword(e, args) },
        disabled: false,
        itemVisibilityOverride: (args) => this.checkPasswordAdminVisibility(args.dataContext),
      },
      {
        command: 'Manage_Role',
        iconCssClass: 'fa fa-cogs',
        title: 'Manage Role',
        // positionOrder: menuOrder++,
        action: (e, args) => { this.manageUserRole(args.dataContext) },
        disabled: false
      },
    ]
  }

  toggleActivation(e, arge) {
    debugger
    var payload = {
      userId: arge.dataContext.userId,
      userStatus: '',
      allowLogin: 0,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    const currentStatus = arge.dataContext.userStatus;
    const currentAllowLogin = arge.dataContext.allowLogin;
    const status = this.checkStatus(currentStatus, currentAllowLogin);
    // console.log(arge.dataContext.allowLogin);
    // var payload = arge.dataContext;
    // payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
    // this.cs.sendRequestAdmin(this, ActionType.TOGGLE_ACTIVATION, ContentType.User, 'activeToggleUser', payload);

    console.log(arge.dataContext.allowLogin);
// var payload = arge.dataContext;
//const status = this.checkStatus(arge.dataContext.userStatus, arge.dataContext.allowLogin);
    payload.userStatus = status == 'Approve Inactive User'
      ? 'INACTIVE' : status == 'Inactive User'
        ? 'PEND_INACTIVE' : status == 'Approve Active User'
          ? 'ACTIVE' : 'PEND_ACTIVE';
    // payload.userStatus === 'ACTIVE'
    //   ? 'PEND_INACTIVE' : payload.userStatus === 'PEND_INACTIVE'
    //     ? 'INACTIVE' : payload.userStatus === 'INACTIVE' ? 'PEND_ACTIVE'
    //       : payload.userStatus === 'PEND_ACTIVE' ? 'ACTIVE' : payload.userStatus;
    payload.allowLogin = arge.dataContext.allowLogin == 'No' ? 0 : 1;

    debugger
    Swal.fire({
      icon: 'question',
      // title: `Are you want to ${status}?`,
      title: `Want to Submit?`,
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: 'No',
    }).then((r) => {
      if (r.isConfirmed) {
        this.loading.set(true);

        console.log('Sending payload:', payload);

        this.cs.sendRequestAdmin(this, ActionType.USER_ACTIVATION, ContentType.User, 'activeToggleUser', payload);
      }
    })
  }
  checkStatus(userStatus: string, allowLogin: string): string {
    let status = '';
    if (allowLogin == 'Yes') {
      if (userStatus == 'PEND_INACTIVE') {
        status = 'Approve Inactive User';
      }
      else {
        status = 'Inactive User'
      }
      // status = 'Inactive User'
    } else if (allowLogin == 'No') {
      if (userStatus == 'PEND_ACTIVE') {
        status = 'Approve Active User';
      }
      else {
        status = 'Active User'
      }
      // status = 'Active User'
    }
    return status;
    // return (userStatus == 'ACTIVE' && allowLogin == 'Yes') ? "Inactive User"
    //   : (userStatus == 'PEND_INACTIVE' && allowLogin == 'Yes')
    //     ? "Approve Inactive User" : (userStatus == 'INACTIVE' && allowLogin == 'No')
    //       ? "Active User" : (userStatus == 'PEND_ACTIVE' && allowLogin == 'No')
    //         ? "Approve Active User" : "";
  }


  // allowManageUserRole(){
  //   if (this.cs.forceAllow()) {
  //     return true;
  //   }
  //   if (this.cs.hasAnyRole(this.userService.userAdminMakerRoles)) {
  //     return true;
  //   }

  //   return false;
  // }

  handleRefresh() {
  }

  headerMenu() {
    var items: MenuCommandItem[] = [
      {
        command: "Refresh",
        action: (e, args) => { this.handleRefresh() },
        title: "Refresh",
        positionOrder: 100,
        cssClass: "fa fa-refresh"
      },
      {
        divider: true, command: '', positionOrder: 2
      },
    ]
    var header = {
      items: items
    }
    return header;

  }

  buildUserDataset() {
    if (!this.showGrid) {
      this.showGrid = true;
    }
    this.userList.forEach(e => {
      e.allowLogin = e.allowLogin == 1 ? 'Yes' : 'No';
    });
    let dt: CustomGridData = {
      content: this.userList,
      total: this.total,
      totalPages: this.totalPages,  
      pageSize: this.pageSize,    
    }
    this.dataset.set(dt);
    // this.dataset = of(dt);

    console.log('user list ', this.dataset());

  }

  onResponse(service: Service, req: any, response: any) {
    this.loading.set(false);

    this.callPagination = false;

    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response));
      return;
    }
    debugger
    if (response.header.referance == 'select') {
      if (response.payload.content.length > 0) {
        this.userList = response.payload.content;
        this.total = response.payload?.page.totalElements;
        this.totalPages = response.payload?.page.totalPages;

        this.buildUserDataset();
        // this.cdf.detectChanges();

      }
    }
    else if (response.header.referance == 'select_app') {
      this.userList = response.payload.content;
      this.total = response.payload.totalElements;

      Swal.fire({ title: "User successfully approved.", toast: true, timer: 1000 }).then(r =>
        this.buildUserDataset());
    }
    else if (response.header.referance == 'RESET_PASSWORD') {
      if (response.payload) {

        Swal.fire({ title: `Default password send successfull to ${response.payload.email}.`, toast: true, timer: 1000 });
      }


      // this.buildUserDataset());
    }
    else if (response.header.referance == 'onDeleteBtnClick') {
      this.userList = response.payload.content;
      this.total = response.payload.totalElements;
      this.loadUser({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      });
      this.buildUserDataset();
      Swal.fire({ title: "Successfully delete user.", toast: true, timer: 1000 });
    }
    else if (response.header.referance == 'activeToggleUser') {
      console.log('receive responce', response);
      if(response.payload){
        this.loadUser();
        Swal.fire({ 
          title: "User status changed successfully", 
          icon: 'success',
          toast: true, 
          timer: 2000 
        });
      } else {
        Swal.fire({
          title: "User status not changed",
          icon: 'error',
          toast: true,
          timer: 2000
        });
      }
    this.loadUser();
    }

  }

  onError(service: Service, req: any, response: any) {
    this.loading.set(false);

    this.callPagination = false;

    console.log('error');
  }

  // height: number;
  // width: number;

  // @HostListener('window:resize', ['$event'])
  // getWindowSize() {
  //   this.height = window.innerHeight * 0.7;
  //   // this.width = document.getElementById('id')?.offsetWidth;
  //   // debugger
  //   // let grid = document.getElementById('userGridId');
  //   // if (grid) {
  //   //   grid.style.width = this.width + 'px';
  //   //   this.angularGrid.slickGrid.resizeCanvas();
  //   // }
  // }

}
