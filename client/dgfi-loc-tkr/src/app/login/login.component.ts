import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { Softcafe } from '../softcafe/common/Softcafe';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';
import { CommonService } from '../softcafe/service/common.service';
// import { EncrDecrService } from '../softcafe/service/encr-decr.service';
import { Service } from '../softcafe/service/service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent extends Softcafe implements OnInit, Service {

  // encrService = inject(EncrDecrService)
  fb = inject(FormBuilder)
  cs = inject(CommonService)
  router = inject(Router)

  showProgress = false
  clickLoginBtn = false


  loginForm: FormGroup = this.fb.group({
    loginName: [null, Validators.required],
    password: [null, Validators.required]
  });

  

  constructor() {
    super()
  }

  ngOnInit(): void {

  }

onLogin() {
  console.log("Login...");
  Swal.fire({
    title: 'নিশ্চিতকরণ',
    text: 'আপনি কি নিশ্চিত যে লগইন করতে চান?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'হ্যাঁ, লগইন করুন',
    cancelButtonText: 'বাতিল'
  }).then((result) => {
    if (result.isConfirmed) {
      this.clickLoginBtn = true;
      if (this.loginForm.invalid) {
        return;
      }
      const sKey = environment.SECRET_KEY;
      //this.router.navigate(['/dashboard']);
      var payload = this.loginForm.value;
      //payload.password = this.encrService.set(environment.SECRET_KEY, payload.password);

      this.showProgress = true;
      this.clickLoginBtn = true;
      this.cs.sendRequestPublic(this, ActionType.LOGIN, ContentType.User, 'login', payload, "/login");
    }

  });
}

 xonLogin() {
    console.log("Login...");
    this.clickLoginBtn = true;
    if (this.loginForm.invalid) {
      return;
    }
    const sKey = environment.SECRET_KEY;
    //this.router.navigate(['/dashboard']);
    var payload = this.loginForm.value;
    //payload.password = this.encrService.set(environment.SECRET_KEY, payload.password);


    this.showProgress = true;
    this.clickLoginBtn = true;
    this.cs.sendRequestPublic(this, ActionType.LOGIN, ContentType.User, 'login', payload, "/login");
  }

  onResponse(service: Service, req: any, basicRes: any) {
    console.log('success');

    this.showProgress = false;
    this.clickLoginBtn = false;
    var response = basicRes.res ?? basicRes;

    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response))
      return;
    }

    if (response.header.referance == 'login') {
      this.clickLoginBtn = false;
      debugger

      if (response.payload.length > 0) {
        // don't worry about this error in this variable.
        // this is global variable declare in index.html file
        var user = response.payload[0];
        if (user.allowLogin != 1) {
          //TODO:
          //alert("Sorry! You are not allow to login.");
          Swal.fire({ text: "Sorry! You are not allow to login." })
          //this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! You are not allow to login.' });
          this.loginForm.get('password').setValue(null);
          this.router.navigate(['/login']);
          return;
        }
        else {
          sessionStorage.setItem("AUTH_TOKEN", basicRes.token);
          sessionStorage.setItem("IS_AUTHENTICATED", basicRes.authenticated);
          this.cs.storeLoginUser(response.payload[0]);
          this.router.navigate(['/dashboard'])

        }
      }
      else {
        Swal.fire({ text: "Invalid username or password" })
        //alert("Invalid username or password");
      }
    }
    else if (response.header.referance == 'onVerify2FaLogin') {
      var user = response.payload[0];
      this.cs.storeLoginUser(response.payload[0]);
      this.router.navigate(['/dashboard']);
    }


  }
  onError(service: Service, req: any, response: any) {
    Swal.fire(response.message);
    console.log(response);
  }

}
