import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SoftAlertService {

  constructor() { }

  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', animation: boolean = false, customClass?: any) {
    return Swal.fire({
      title,
      text: message,
      icon: type,
      animation: animation,
      customClass: customClass,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });
  }

  showConfirmation(title: string, message: string, animation: boolean = false, confirmButtonText: string = 'Yes', cancelButtonText: string = 'No') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      animation: animation,
      showClass: {
        popup: 'animated bounceIn'
      },
      hideClass: {
        popup: 'animated bounceOut'
      }
    });
  }
}
