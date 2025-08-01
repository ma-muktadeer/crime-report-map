import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {

  formateTime(time: any): string {
    if(!time){
      return '';
    }
    try {
      const today = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

      return Intl.DateTimeFormat('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dhaka',
        hour12: true,
      }).format(dateTime);

    } catch (e) {
      console.error('Error formatting time:', e);
      return '';
    }
  }

  toBengaliNumerals(nmb: string): string {
    // console.log('nmb', nmb);
    if (!nmb || nmb == '0' || nmb == '০') {
      return '';
    }
    try {
      return Intl.NumberFormat('bn-BD', {
        useGrouping: false,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(parseInt(nmb, 10));
    }
    catch (error) {
      console.error('Error formatting number:', error);
      return nmb;
    }
  }

  toBengaliNumeralsD0(nm: string): string {
    if (!nm ) {
      return '০';
    }
    try {
      return this.toBengaliNumerals(nm);
    } catch (error) {
      console.error('Error formatting number:', error);
      return '';
    }
}


  convirtBn(arg0: string): string {
    if (!arg0 || arg0 == '0') {
      return '';
    }
    try {
      const nmLs = arg0.split('/');
      return this.toBengaliNumerals(nmLs[0]) + nmLs[1] ? '/' + this.toBengaliNumerals(nmLs[1]):'';
    } catch (error) {
      console.error('Error converting number:', error);
      return '';
    }
}


  toBengaliNumbersWithMin2(input: string): string {
    if (!input || input == '0') {
      return '';
    }
    return Intl.NumberFormat('bn-BD', {
      useGrouping: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      minimumIntegerDigits: 2,
    }).format(parseInt(input, 10));
  }

  public formatToBengaliDate(dateString: string): string {
    return Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      timeZone: 'Asia/Dhaka',
    }).format(new Date(dateString));
  }
  formateMothAndYear(dateString: string): string {
    return Intl.DateTimeFormat('bn-BD', {
      year: '2-digit',
      month: 'long',
      timeZone: 'Asia/Dhaka',
    }).format(new Date(dateString));
  }
  formateWeek(dateString: string): string {
    const [dy, date] = dateString.split('-');
    const dt = this.toBengaliNumbersWithMin2(dy);
    const fd = Intl.DateTimeFormat('bn-BD', {
      day: '2-digit',
      month: 'long',
      timeZone: 'Asia/Dhaka',
    }).format(new Date(date));

    return `${dt}-${fd}`;
  }

  formatFrom2To(fromDate: string, toDate: string): string {
    return `${this.formatToBengaliDate(fromDate)} হতে ${this.formatToBengaliDate(toDate)}`;
  }
}
