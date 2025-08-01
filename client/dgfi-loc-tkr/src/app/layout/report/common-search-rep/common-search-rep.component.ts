import { DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartType } from 'chart.js';
import { Dayjs } from "dayjs";
import { NgxDaterangepickerBootstrapModule } from "ngx-daterangepicker-bootstrap";
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { Address } from '../../dgfi/address';

@Component({
  selector: 'app-common-search-rep',
  templateUrl: './common-search-rep.component.html',
  styleUrls: ['./common-search-rep.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgxDaterangepickerBootstrapModule, NgClass],
})
export class CommonSearchRepComponent extends Softcafe implements Service, OnInit {

  @Output() onSearchAction = new EventEmitter<any>();
  @Input() isTimeInterval = signal<boolean>(false);
  @Input() isChart: boolean = true;
  @Input() isCompareBy = signal<boolean>(false);
  @Input({ required: true }) type!: string;
  @Input() isLoading = signal<boolean>(false);
  readonly cs = inject(CommonService);
  chartType: ChartType = 'bar';
  types: { id: number, name: string, nameBangla: string, openType?: string }[] = [
    { id: 1, name: 'POLITICAL', nameBangla: 'রাজনৈতিক', openType: 'TABULAR' },
    { id: 2, name: 'CRIME', nameBangla: 'কর্মসূচি' },
  ];
  typeOfSearch = signal<string>(null);

  addressService: Address = new Address();
  searchForm: FormGroup;
  crimeList = signal<any[]>(null);
  divisionList = signal<any[]>(null);
  districtList = signal<any[]>(null);
  politicalPartyList = signal<any[]>(null);
  showOtherInput = signal<boolean>(false);
  chartTypes: { value: ChartType, display: string }[] = [
    { value: 'bar', display: 'বার চার্ট' },
    { value: 'pie', display: 'পাই চার্ট' },
    { value: 'line', display: ' লাইন চার্ট' }
  ];
  selected: { startDate: Dayjs, endDate: Dayjs };
  isSubmitted = signal<boolean>(false);
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

  constructor(private fb: FormBuilder) {
    super();
    this.searchForm = this.fb.group({
      typeOfCrimeIdList: [null],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      divisionId: [null],
      chartType: [this.chartType],
      type: [null],
      districtId: [{ value: null, disabled: true }],
      timeInterval: ['monthly'],
      compareBy: ['monthly'],
      politicalPartyId: [null],
      politicalPartyName: [''],
    });
  }

  ngOnInit() {
    // this.onLoadCrimeType();
    this.addressService.loadInitLocation(this);
  }

  loadLocation(event: any, locationType: string, ref: string) {
    this.addressService.loadLocation(event, locationType, ref, this);
  }
  onPartyChange(event: any) {
    this.showOtherInput.update(() => event.target?.value == 0);
  }

  changeType(type: string) {
    this.typeOfSearch.update(() => type);
    this.searchForm.get('type').setValue(this.typeOfSearch());
    this.onLoadCrimeType();
    if (this.type == 'TABULAR') {
      this.onLoadPolitycalParty();
    }
  }

  onLoadCrimeType() {
    let payload: any = {
      configGroup: `${this.typeOfSearch()}_GROUP`,
      configSubGroup: `${this.typeOfSearch()}_SUB_GROUP`,
      // configGroup: "CRIME_GROUP",
      // configSubGroup: "CRIME_SUB_GROUP",
    };

    this.cs.sendRequestAdmin(this, ActionType.SELECT_2, ContentType.SConfiguration, 'SELECT', payload);
  }

  onLoadPolitycalParty() {
    const payload = {
      configGroup: "POLITICAL_PARTY_GROUP",
      configSubGroup: "POLITICAL_PARTY_SUB_GROUP",
    };

    this.cs.sendRequest(this, ActionType.SELECT_2, ContentType.SConfiguration, 'POLITICAL', payload);
  }

  onSubmit(): void {
    this.isSubmitted.update(() => true);
    console.log('Form Data:', this.searchForm.value);
    if (this.searchForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'ফর্মটি সঠিক নয়',
        text: 'অনুগ্রহ করে সব প্রয়োজনীয় ঘর সঠিকভাবে পূরণ করুন।',
        confirmButtonText: 'ঠিক আছে'
      });
      return;
    }
    if (this.searchForm.valid) {
      if (this.searchForm.get('typeOfCrimeIdList')?.value?.length == 0 || !this.searchForm.get('typeOfCrimeIdList')?.value?.length) {
        this.searchForm.get('typeOfCrimeIdList')?.setValue(null);
      }
      this.onSearchAction.emit({ ...this.searchForm.value, type: this.typeOfSearch() });
    }
  }

  // Handle checkbox changes
  onCrimeTypeChange(event: Event, configId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentValues = this.searchForm.get('typeOfCrimeIdList')?.value as number[];

    if (isChecked) {
      this.searchForm.get('typeOfCrimeIdList')?.patchValue([...currentValues || [], configId]);
    } else {
      this.searchForm.get('typeOfCrimeIdList')?.patchValue(
        currentValues.filter(id => id !== configId)
      );
    }
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

  onResponse(service: Service, req: any, res: any) {

    if (!super.isOK(res)) {
      console.log('getting error', super.getErrorMsg(res));
      return;
    }
    if (res.header.referance == 'SELECT') {
      console.log(res.payload);
      this.crimeList.set(res.payload);
    }
    else if (res.header.referance == 'SELECT_DIVISION') {
      console.log(res.payload);
      this.divisionList.set(res.payload);
      this.districtList.set(null);
      this.searchForm.get('divisionId')?.setValue(null);
      this.searchForm.get('districtId')?.setValue(null);
    }
    else if (res.header.referance == 'SELECT_DISTRICT') {
      console.log(res.payload);
      this.districtList.set(res.payload);
      this.searchForm.get('districtId')?.enable();
      this.searchForm.get('districtId')?.setValue(null);
    }
    else if (res.header.referance == 'POLITICAL') {
      console.log(res.payload);
      this.politicalPartyList.set(res.payload);
    }

  }
  onError(service: Service, req: any, res: any) {
    this.isLoading.update(() => false);

    throw new Error('Method not implemented.');
  }
}
