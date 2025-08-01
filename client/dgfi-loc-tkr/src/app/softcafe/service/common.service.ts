

/**
 * @author Md Kamruzzaman
 */

import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../../config.service';
import { AppRole } from '../common/AppRole';
import { Constants } from '../common/Constants';
import { ActionType } from '../constants/action-type.enum';
import { ContentType } from '../constants/content-type.enum';
import { Service } from './service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  config = inject(ConfigService)

  constructor(private http: HttpClient, private router: Router) {
  }

  /**
   * This method responsible for communicating with server.
   * All request pass to server and return to sender [onResponse] if success.
   * if not access to server response will return to sender [onError] method
   * 
   * @param service Service
   * @param actionType ActionType
   * @param contentType ContentType
   * @param referance string
   * @param payload any
   */
  public sendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {
    this.doSendRequest(service, actionType, contentType, referance, payload);
  }

  public sendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestPublic(service, actionType, contentType, referance, payload, path);
  }



  private doSendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? environment.SERVER_BASE_URL_PUBLIC + path : environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"

    this.http.post(url, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }

  public sendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestAdmin(service, actionType, contentType, referance, payload, path);
  }


  private doSendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? environment.SERVER_BASE_URL_ADMIN + path : environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"
    /* let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem("AUTH_TOKEN")
    });
    let options = { headers: headers }; */
    this.http.post(url, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }


  private doSendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path?: string) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);
    var url = path ? environment.SERVER_BASE_URL + path : environment.SERVER_BASE_URL + "/jsonRequest"
    this.http.post(url, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }

  public post(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    return this.http.post(environment.SERVER_URL, req)
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }



  public execute(actionType: ActionType, contentType: ContentType, payload: any) {

    var req = this.generateReqJson(actionType, contentType, '', payload);

    const url = environment.SERVER_BASE_URL + "/jsonRequest"
    
    return this.http.post(url, req);
  }

  public executePublic(actionType: ActionType, contentType: ContentType, payload: any, path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? environment.SERVER_BASE_URL_PUBLIC + path : environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"
    return this.http.post(url, req);

  }

  public executeAdmin(actionType: ActionType, contentType: ContentType, payload: any, path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? environment.SERVER_BASE_URL_ADMIN + path : environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"
    return this.http.post(url, req);

  }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }


  public generateReqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var loginUser = this.loadLoginUser();
    var userId = null;
    let customerId = null;
    if (loginUser && loginUser.userId) {
      userId = loginUser.userId;
      customerId = loginUser.customerId;
    }

    var header = {
      actionType: actionType.toString(),
      contentType: contentType.toString(),
      referance: referance,
      userId: userId,
      customerId: customerId,
      extraInfoMap: {
        appName: this.config.config.app.constantAppName
      }
    };

    var data = {
      header: header,
      payload: payload instanceof Object ? [payload] : payload
    }
    return data;

  }

  public reqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any): string {

    var req = this.generateReqJson(actionType, contentType, referance, payload);
    return JSON.stringify(req);

  }

  public storeLoginUser(loginUser: any) {
    sessionStorage.setItem(Constants.APP_LOGIN_USER, JSON.stringify(loginUser))
  }

  public loadLoginUser(): any {
    var loginUser = sessionStorage.getItem(Constants.APP_LOGIN_USER)
    if (loginUser && loginUser != 'undefined') {
      return JSON.parse(loginUser);
    }
    else {
      return null;
    }
  }

  isSameUser(creatorId) {
    var loggged = this.loadLoginUser();
    if (loggged.loginName == 'softcafe') {
      return false;
    }
    return this.getUserId() == creatorId
  }

  forceAllow() {
    var logg = this.loadLoginUser();
    return logg.loginName == 'softcafe'
  }

  public getUserId(): Number {
    var loginUser = this.loadLoginUser();
    console.log(loginUser);
    if (loginUser && loginUser.userId) {
      return loginUser.userId
    }
    return null;
  }

  isAuthenticated() {
    var auth = sessionStorage.getItem("IS_AUTHENTICATED");

    if (auth) {
      return (auth.toLowerCase() === 'true');
    }

    return false;
  }

  public loadLoginUserRoleList() {
    var loginUser = sessionStorage.getItem(Constants.APP_LOGIN_USER);
    if (loginUser) {
      return JSON.parse(loginUser).roleList;
    }
    else {
      return null;
    }
  }

  public logout(service: Service) {
    //if logged in status
    debugger
    if (this.isAuthenticated()) {
      var isLoggedIn = this.isLoggedIn();
      var loginUser = this.loadLoginUser();
      this.storeLoginUser({});
      localStorage.removeItem('permission');

      //loginUser = this.loadLoginUser();
      var payload = {
        userId: loginUser.userId,
      }
      this.sendRequestAdmin(service, ActionType.LOGOUT, ContentType.User, 'logout', payload);

      // this.router.navigate(['/login'])
    }
  }

  removeSession() {
    sessionStorage.removeItem("IS_AUTHENTICATED");
    sessionStorage.removeItem("AUTH_TOKEN");
    sessionStorage.removeItem("APP_LOGIN_USER");
    sessionStorage.clear();
  }


  public isLoggedIn(): boolean {
    return this.isAuthenticated()
  }

  public hasAllRole(roleArray: AppRole[]): boolean {
    if (!roleArray) {
      return false;
    }
    var roles = this.loadLoginUserRoleList()
    if (!roles) {
      return false;
    }

    var roless = this.roleArray(roles)
    return roleArray.every(x => roless.indexOf(x) > -1)
  }
  private roleArray(roles) {
    var roleArray = [];
    if (!roles) {
      return roleArray;
    }

    for (var i = 0; i < roles.length; i++) {
      roleArray.push(roles[i].roleName);
    }
    return roleArray;

  }
  public hasAnyRole(roles: AppRole[]): boolean {

    if (!roles) {
      return false;
    }
    var loginUser = this.loadLoginUser();
    var userRoles = loginUser.roleList;
    var loginRoleArray = this.roleArray(userRoles);
    if (!userRoles) {
      return false;
    }
    return roles.some(r => loginRoleArray.indexOf(r) >= 0);
  }

  public filePostBySecure(path: string, formData: FormData, header?: HttpHeaders, observe: 'body' | 'events' = 'body', responseType: 'text' | 'json' = 'json'): Observable<any> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem("AUTH_TOKEN")}`,
      'UserId': this.getUserId() + '',
      ...header,
    });

    // if (header) {
    //   headers = header;
    // }

    const request = {
      reportProgress: true,
      observe: 'events',
      headers: headers,
    };


    return this.http.post(environment.SERVER_BASE_URL + path, formData, {
      reportProgress: true,
      observe: observe as any,
      headers: headers,
      responseType: responseType as any
    });
  }

  public fileDownload(path: string, payload: any, header?: HttpHeaders): Observable<any> {

    return this.http.request('POST', environment.SERVER_BASE_URL + path, {
      body: payload,
      headers: header,
      observe: 'events',
      reportProgress: true,
      responseType: 'blob',
    })
      .pipe(
        map((event) => this.mapProgress(event))
      );

  }

  mapProgress(event: HttpEvent<any>): any {

    switch (event.type) {
      case HttpEventType.UploadProgress:
        return {
          progress: 10,
          state: 'progress',
        };
      case HttpEventType.ResponseHeader:
        return {
          progress: 15,
          state: 'progress',
        };
      case HttpEventType.DownloadProgress:
        return {
          progress: Math.round((event.loaded / (event.total || 1)) * 100),
          state: 'progress',
        };
      case HttpEventType.Response:
        return {
          progress: 100,
          state: 'completed',
          file: event.body,
          fileName: this.getFileName(event),
        };
      default:
        return {
          state: 'unknown'
        };
    }
  }
  getFileName(event: HttpResponse<any>) {
    const contentDisposition = event?.headers?.get('Content-Disposition');
    let fileName = '';

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }
    return fileName;
  }




}
