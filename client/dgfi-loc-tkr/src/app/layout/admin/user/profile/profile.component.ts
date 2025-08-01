import { Location, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { formatDateForInput } from '../../../../softcafe/common/CommonMethod';
import { Softcafe } from '../../../../softcafe/common/Softcafe';
import { ActionType } from '../../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../../softcafe/constants/content-type.enum';
import { CommonService } from '../../../../softcafe/service/common.service';
import { Service } from '../../../../softcafe/service/service';
import { SoftAlertService } from '../../../service/soft-alert.service';
import { UserService } from '../../../service/user.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [ReactiveFormsModule, NgClass,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',

})
export class ProfileComponent extends Softcafe implements Service, OnInit {

  @Input()
  isPopup: boolean = false;
  @Input()
  isUpdate: boolean = false;
  @Input()
  isViewMode: boolean = false;

  @Input()
  currentUser: any;

  profile: FormGroup = new FormBuilder().group({
    userId: [null],
    employeeId: [''],
    firstName: ['',[Validators.required]],
    lastName: [''],
    phoneNumber: [''],
    email: ['', [Validators.required]],
    branch: [''],
    designation: [''],
    nid: [''],
    password: ['',[Validators.required]],
    confirmPassword: ['', [Validators.required]],
    dob: [''],
    remarks: [''],
    loginName: ['', [Validators.required]],
  });
  isValidConfirmPass: boolean;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordFocused: boolean = false;


  constructor(
    @Optional() private modelRef: NgbActiveModal,
    private alert: SoftAlertService,
    private location: Location,
    private cs: CommonService,
    private userService: UserService
  ) {
    super();

  }

  resetForm() {
    this.profile.reset();

  }
  
  ngOnInit(): void {
    
    if (this.currentUser) {
      this.profile.patchValue(this.currentUser);
      this.profile.get('dob').setValue(formatDateForInput(this.currentUser?.dob));
    }
    this.profile.get('password').clearValidators();
    this.profile.get('confirmPassword').clearValidators();
    this.profile.get('password').updateValueAndValidity();
    this.profile.get('confirmPassword').updateValueAndValidity();
  }

  keyPress(event: any, isConfPass: boolean = false) {
    debugger
    if (isConfPass) {
      this.isValidConfirmPass = this.profile.get('password').value == event.target.value;
    } else {
      this.isValidConfirmPass = false;
      this.profile.get('confirmPassword').setValue('');
    }

  }

  closePopup(res: any) {
    if (this.modelRef) {
      this.modelRef.close(res);
    } else if (this.isPopup) {
      this.location.back();
    }
  }

  onSubmit(): void {
    debugger

    if (this.profile.invalid) {
    
      this.profile.markAllAsTouched();

      this.alert.showAlert('ত্রুটি', '* চিহ্নিত ক্ষেত্রগুলি আবশ্যক..!', 'error', true);
      return;
    }
    // if (this.profile.valid) {
    //   console.log('Form Submitted:', this.profile.value);

    // }
    // if(this.profile.invalid || !this.isValidConfirmPass){
    //   this.alert.showAlert('Error', '*Mark fileds are mandatory..!', 'error', true);
    // return;      
    // }
    if(this.profile.invalid || (!this.isUpdate && !this.isValidConfirmPass)){
      this.alert.showAlert('ত্রুটি', '* চিহ্নিত ক্ষেত্রগুলি আবশ্যক..!', 'error', true);
      return;      
    }
debugger
    const payload = this.profile.value;

 // payload.fullName = payload.firstName??'' + ' ' + payload.lastName??'';
  payload.fullName = (payload.firstName ?? '') + ' ' + (payload.lastName ?? '');

    if (this.isUpdate) {
      payload.userId = this.currentUser.userId;
    }

    this.cs.sendRequestAdmin(this, this.isUpdate ? ActionType.UPDATE : ActionType.NEW, ContentType.User, 'NEW', payload);

  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }
    else if (res.header.referance === 'NEW') {
      Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: this.isUpdate ? 'ব্যবহারকারী সফলভাবে আপডেট করা হয়েছে' : 'নতুন ব্যবহারকারী সফলভাবে সংরক্ষণ করা হয়েছে',
        showConfirmButton: false,
        timer: 1500
      });
      this.resetForm();
      if (this.isPopup) {
        this.closePopup(res.payload);
      }

    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');

  }

}


