import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppPermission, PermissioinStoreService } from './permissioin-store.service';

@Injectable({
  providedIn: 'root'
})
export class DisableRightClickServiceService {

  private appPermission = AppPermission;

  constructor(@Inject(DOCUMENT) private document: Document, private permissionService: PermissioinStoreService) { }

  disableRightClick() {
    if (environment.disableRightClick) {
      this.document.addEventListener('contextmenu', (event) =>
        event.preventDefault()
      );
      this.document.addEventListener('keyup', (event) => {
        if (event.keyCode == 44 || event.keyCode == 123) {
          alert('Please don\'t try to take picture.');
          this.preventScreenshot();
          event.stopPropagation();
          return event.preventDefault();

        }
      }
      );
      this.document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey && event.shiftKey && event.key === 'I')
          || (event.ctrlKey && event.shiftKey && event.key === 'J')
          || (event.ctrlKey && event.shiftKey && event.key === 'C')
          || (event.ctrlKey && event.key === 'u')
        ) {
          return event.preventDefault();
        }
      })
      // return event.preventDefault()
    }

  }

  private preventScreenshot() {
    // Overlay a transparent div on top of the content
    var inpFld = document.createElement("input");
    inpFld.setAttribute("value", ".");
    inpFld.setAttribute("width", "0");
    inpFld.style.height = "0px";
    inpFld.style.width = "0px";
    inpFld.style.border = "0px";
    document.body.appendChild(inpFld);
    inpFld.select();
    document.execCommand("copy");
    inpFld.remove();

  }


  disableCopy(event: Event) {
    if(environment.disableRightClick){
      if (!this.permissionService.hasPermission(this.appPermission.COPY_TEXT)) {
        console.log("desable text selection....");
        event.preventDefault();
      }
    }
  }
}
