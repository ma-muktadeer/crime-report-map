import { Injectable, OnInit } from '@angular/core';
import { Softcafe } from '../common/Softcafe';
import { Service } from './service';
import { ActionType } from '../constants/action-type.enum';
import { ContentType } from '../constants/content-type.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends Softcafe implements Service{

  public location : Object;

  public countryList : Array<Object>;
  public divisionList : Array<Object>;
  public districtList : Array<Object>;
  public thanaList : Array<Object>;

  constructor(private cs : CommonService) { 
    super();
    console.log("Init Location Service");

    var payload = {};
    this.cs.sendRequest(this, ActionType.LOAD_LOCATION, ContentType.Location, 'loadLocation', payload);

    console.log(location);
  }


  onResponse(service: Service, req: any, response: any) {

    if (!super.isOK(response)) {
      alert(super.getErrorMsg(response));
      return;
    }
    if (response.header.referance == 'loadLocation') {
      console.log(response.payload);
      this.countryList = response.payload.countryList;
      this.divisionList = response.payload.divisionList;
      this.districtList = response.payload.districtList;
      this.thanaList = response.payload.thanaList;
    }

  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }
}
