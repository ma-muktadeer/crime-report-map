// Angular Import
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, Input, input, OnInit } from '@angular/core';

// bootstrap
import { Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Softcafe } from '../../../../../softcafe/common/Softcafe';
import { CommonService } from '../../../../../softcafe/service/common.service';
import { Service } from '../../../../../softcafe/service/service';
import { ProfileComponent } from '../../../../admin/user/profile/profile.component';
@Component({

  selector: 'app-nav-right',

  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  standalone: false,
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent extends Softcafe implements OnInit, Service {

  protected cs = inject(CommonService);
  protected router = inject(Router);
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  user: any;
  updateDialog: NgbModalRef | null = null;
  userList: Array<any> = [];
  total: number;
  // constructor
  constructor(
    private modalService: NgbModal 
  ) {
    super();
    this.visibleUserList = false;
    this.chatMessage = false;
  }

 
  ngOnInit(): void {
      this.user = this.cs.loadLoginUser();
  }

  
  openProfile() {
    debugger
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: true
    };
   const currentUser = this.cs.loadLoginUser();

    this.updateDialog = this.modalService.open(ProfileComponent, modalOptions);
    this.updateDialog.componentInstance.isPopup = true;
    this.updateDialog.componentInstance.isViewMode = false;
    this.updateDialog.componentInstance.isUpdate = true;
    this.updateDialog.componentInstance.userId = currentUser.userId;
    this.updateDialog.componentInstance.currentUser = currentUser;
 

  } 
  
  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }


  logout() {
    this.cs.logout(this);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    // if(!super.isOK(res)){
    //   alert(super.getErrorMsg(res));
    //   return;
    // }
    if (res.header.referance === 'logout') {
      this.router.navigate(['/login']);
    }

  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
