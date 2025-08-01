import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfigModifyComponent } from '../config-modify/config-modify.component';

@Component({
  selector: 'app-config-modify-icon',
  imports: [NgbTooltip],
  templateUrl: './config-modify-icon.component.html',
  styleUrl: './config-modify-icon.component.scss'
})
export class ConfigModifyIconComponent {

  @Input({ required: true }) configurationList: Array<any[]>;
  @Input({ required: true }) title: string;

  @Output("onConfigModify") onConfigModify = new EventEmitter()

  constructor(private modalService: NgbModal) {
  }


  onConfigEdit() {
    console.log("Opening configuration modification", this.configurationList);
    const modalRef = this.modalService.open(ConfigModifyComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.title = this.title
    modalRef.componentInstance.configs = this.configurationList

    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.configurationList = result.slice()
        this.onConfigModify.emit(this.configurationList);
      },
      (reason) => {
        console.log('Dismissed with:', reason);
        this.onConfigModify.emit(this.configurationList);
      }
    );
  }

}
