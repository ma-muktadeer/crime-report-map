import { Component, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-modify',
  imports: [FormsModule, NgbTooltipModule],
  templateUrl: './config-modify.component.html',
  styleUrl: './config-modify.component.scss'
})
export class ConfigModifyComponent extends Softcafe implements Service {


  configForm: FormGroup;
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) set configs(value: Array<any[]>) {
    this.configList.update(() => value);
  }

  configList = signal<any[]>([]);

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private cs: CommonService) {
    super()
    console.log("Config Grid", this.configList());

  }


  onItemEdit(config) {
    debugger
    console.log(config);
    // if (e.key == 'Enter') {
    this.cs.sendRequest(this, ActionType.SAVE, ContentType.SConfiguration, "SAVE", config);
    // }
  }

  onDelete(config) {
    console.log(config);
    Swal.fire({
      title: "আপনি কি নিশ্চিত যে আপনি এই তথ্য মুছে ফেলতে চান? 🗑️",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting configuration ", config);
        config.active = 0;
        this.cs.sendRequest(this, ActionType.DELETE, ContentType.SConfiguration, "SAVE", config);
      }
    });

  }

  onClose() {
    this.activeModal.close(this.configList());
  }


  onResponse(service: Service, req: any, res: any) {
    debugger;
    if (!super.isOK(res)) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: super.getErrorMsg(res),
        timer: 2000,
      });
      return;
    }
    else if (res.header.referance == 'SAVE') {
      console.log(res.payload);
      this.configList.update(() => res.payload);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "আপনার কাজটি সফলভাবে সংরক্ষণ করা হয়েছে। ✅",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
