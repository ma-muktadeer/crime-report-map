import { DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dayjs } from 'dayjs';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import { Address } from '../address';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgxDaterangepickerBootstrapModule, NgClass],
})
export class SearchComponent extends Softcafe implements OnInit, Service {

  @Output() onSearchAction = new EventEmitter<any>();

  searchForm: FormGroup;
  addressService: Address;
  incidentList = signal<any[]>([]);
  divisionList = signal<any[]>(null);
  districtList = signal<any[]>(null);
  upazilaList = signal<any[]>(null);
  selected: { startDate: Dayjs, endDate: Dayjs };
  isSubmitted = signal<boolean>(false);

  types: { id: number, name: string, nameBangla: string }[] = [
    { id: 1, name: 'POLITICAL', nameBangla: 'রাজনৈতিক' },
    { id: 2, name: 'CRIME', nameBangla: 'কর্মসূচি' },
  ];
  type = signal<string>(null);
  bnLocale = {
    format: 'YYYY-MM-DD',
    displayFormat: 'YYYY-MM-DD',
    direction: 'ltr',
    weekLabel: 'W',
    separator: ' থেকে ',
    applyLabel: 'প্রয়োগ করুন',
    cancelLabel: 'বাতিল',
    customRangeLabel: 'কাস্টম',
    daysOfWeek: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'],
    monthNames: [
      'জানু', 'ফেব', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
    ],
    firstDay: 0
  };

  constructor(private fb: FormBuilder, private cs: CommonService) {
    super();
    this.addressService = new Address();
  }


  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      typeOfCrimeId: [null],
      divisionId: [null],
      districtId: [null],
      upazilaId: [null],
      organizationName: [null],
      type: [null, [Validators.required]],
      politicalAffiliation: [null]
    });

    this.addressService.loadInitLocation(this);
  }

  englishToBanglaTypeMap = {
    'POLITICAL': 'রাজনৈতিক',
    'CRIME': 'অপরাধ'
    // Add more mappings as needed
  };

  loadLocation(event: any, locationType: string, ref: string) {
    this.addressService.loadLocation(event, locationType, ref, this);
  }
  changeType(type: string) {
    this.type.update(() => type);
    this.searchForm.get('type').setValue(this.type())
    this.loadCrime(type);
  }

  loadCrime(type: string) {

    let payload: any = {
      configGroup: `${type}_GROUP`,
      configSubGroup: `${type}_SUB_GROUP`,
    };

    this.cs.sendRequestAdmin(this, ActionType.SELECT_2, ContentType.SConfiguration, 'SELECT', payload);

  }
  onDateRangeChange(selectedRange: any): void {
    if (!selectedRange || !selectedRange.start || !selectedRange.end) {
      return;
    }

    const startDate = this.formatDate(selectedRange.start, 'yyyy-MM-dd');
    const endDate = this.formatDate(selectedRange.end, 'yyyy-MM-dd');
    this.searchForm.patchValue({ fromDate: startDate, toDate: endDate });
  }

  formatDate(date: any, format: string): string {
    return new DatePipe('en-US').transform(date, format)!.toString();
  }

  get formDate() {
    return this.searchForm.get('fromDate');
  }
  get toDate() {
    return this.searchForm.get('toDate');
  }

  onSearch(): void {
    this.isSubmitted.update(() => true);
    debugger
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
      this.onSearchAction.emit(this.searchForm.value);
    }
  }

  onDivisionChange(event: any): void {
    this.addressService.loadLocation(event, 'District', 'SELECT_DISTRICT', this);
  }

  onDistrictChange(event: any): void {
    this.addressService.loadLocation(event, 'Thana', 'SELECT_THANA', this);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (res.header.referance == 'SELECT_DIVISION') {
      console.log(res.payload);
      this.divisionList.set(res.payload);
      this.districtList.set(null);
      this.upazilaList.set(null);
      this.searchForm.get('divisionId')?.setValue(null);
      this.searchForm.get('districtId')?.setValue(null);
      this.searchForm.get('upazilaId')?.setValue(null);
    }
    else if (res.header.referance == 'SELECT_DISTRICT') {
      console.log(res.payload);
      this.districtList.set(res.payload);
      this.upazilaList.set(null);
      this.searchForm.get('districtId')?.setValue(null);
      this.searchForm.get('upazilaId')?.setValue(null);
    }
    else if (res.header.referance == 'SELECT_THANA') {
      console.log(res.payload);
      this.upazilaList.set(res.payload);
      this.searchForm.get('upazilaId')?.setValue(null);
    }
    else if (res.header.referance == 'SELECT') {
      console.log(res.payload);
      this.incidentList.update(() => res.payload);
    }
  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
