import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartType } from 'chart.js';
import { Dayjs } from 'dayjs';
import { BaseChartDirective } from 'ng2-charts';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { forkJoin } from 'rxjs';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-economic-report',
  imports: [ReactiveFormsModule, FormsModule, NgxDaterangepickerBootstrapModule, NgClass, BaseChartDirective],
  templateUrl: './economic-report.component.html',
  styleUrl: './economic-report.component.scss'
})
export class EconomicReportComponent extends Softcafe implements Service {
  readonly _cs = inject(CommonService);
  readonly _dateFormaterService = inject(DateFormatterService);
  readonly _chartService = inject(ChartService);

  economicFrom: FormGroup<any> = new FormGroup({});
  typeOfForm = signal<string>(null);
  productsName = signal<any[]>([]);
  // productsUnitName = signal<any[]>([]);
  isClick = signal<boolean>(false);
  isDownload = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  selected: { startDate: Dayjs, endDate: Dayjs };
  chartType: ChartType = 'bar';

  readonly _types: { id: number, name: string, value: string }[] = [
    { id: 1, name: 'পণ্য', value: 'PRODUCTS' },
    { id: 2, name: 'রেমিট্যান্স', value: 'REMITTANCE' },
    { id: 3, name: 'রিজার্ভ', value: 'RESERVE' },
  ];
  readonly _chartTypes: { value: ChartType, display: string }[] = [
    { value: 'bar', display: 'বার চার্ট' },
    { value: 'pie', display: 'পাই চার্ট' },
    { value: 'line', display: ' লাইন চার্ট' }
  ];
  dataset: any;
  local = {
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


  changeType(type: string) {
    this.isClick.update(() => false);
    console.log('type', type);

    this.typeOfForm.update(() => type);

    this.buildForm(type);
  }
  buildForm(type: string) {
    if (type == 'PRODUCTS') {
      this.loadInit();
      this.economicFrom = this.buildForm4Products(type);
    }
    else {
      this.economicFrom = this.buildForm4Others(type);
    }
  }

  buildForm4Others(type: string): FormGroup<any> {
    return new FormGroup({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(null, [Validators.required]),
      compareBy: new FormControl('MONTHLY', [Validators.required]),
      chartType: new FormControl('bar', [Validators.required]),
      type: new FormControl(type),
    });
  }

  buildForm4Products(type: string): FormGroup<any> {
    return new FormGroup({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(null, [Validators.required]),
      compareBy: new FormControl('MONTHLY', [Validators.required]),
      chartType: new FormControl('bar', [Validators.required]),
      idProductNameList: new FormControl(null),
      type: new FormControl(type),
    });
  }

  onDateRangeChange(selectedRange: any): void {
    if (!selectedRange || !selectedRange.start || !selectedRange.end) {
      return;
    }

    const startDate = this.formatDate(selectedRange.start, 'yyyy-MM-dd');
    const endDate = this.formatDate(selectedRange.end, 'yyyy-MM-dd');
    this.economicFrom.patchValue({ fromDate: startDate, toDate: endDate });
  }
  formatDate(date: any, format: string): string {
    return new DatePipe('en-US').transform(date, format)!.toString();
  }
  get formDate() {
    return this.economicFrom.get('fromDate');
  }
  get toDate() {
    return this.economicFrom.get('toDate');
  }

  loadInit() {
    // this.loadProductsUnits();
    forkJoin([this.loadProducts()]).subscribe((res: any) => {

      this.productsName.update(() => res[0].payload);
      // this.productsUnitName.update(() => res[1].payload);

    });
  }

  downloadChart() {
    const chartContainer = document.getElementById('chart-economic')?.parentElement;
    if (chartContainer) {
      this._chartService.downloadChartAsPDF(chartContainer, 'timely-chart.pdf');
    } else {
      console.error('Chart container not found.');
    }
  }

  onSubmit(): void {
    this.isSubmitted.update(() => true);
    console.log('Form Data:', this.economicFrom.value);
    if (this.economicFrom.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.economicFrom.valid) {

      const payload = this.economicFrom.value;
      if (payload.idProductNameList && payload.idProductNameList.length === 0) {
        payload.idProductNameList = null;
      }

      this._cs.sendRequest(this, ActionType.SEARCH, ContentType.Finincial, 'SEARCH', payload);

    }
  }

  loadProducts() {
    const payload = {
      configGroup: 'PRODUCTS_NAME_GROUP',
      configSubGroup: 'PRODUCTS_NAME_SUB_GROUP',
    };

    return this._cs.execute(ActionType.LOAD_PRODUCTS_NAME, ContentType.SConfiguration, payload);
    // this._cs.sendRequest(this, ActionType.LOAD_PRODUCTS_NAME, ContentType.SConfiguration, 'LOAD_PRODUCTS_NAME', payload);
  }
  // loadProductsUnits() {
  //   const payload = {
  //     configGroup: 'PRODUCTS_UNIT_GROUP',
  //     configSubGroup: 'PRODUCTS_UNIT_SUB_GROUP',
  //   };

  //   return this._cs.execute(ActionType.LOAD_PRODUCTS_NAME, ContentType.SConfiguration, payload);
  // }

  onCrimeTypeChange(event: Event, configId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentValues = this.economicFrom.get('idProductNameList')?.value as number[];

    if (isChecked) {
      this.economicFrom.get('idProductNameList')?.patchValue([...currentValues || [], configId]);
    } else {
      this.economicFrom.get('idProductNameList')?.patchValue(
        currentValues.filter(id => id !== configId)
      );
    }
  }

  buildChart(payload: any[], filterDate?: string) {

    this.isDownload.set(true);

    if (this.economicFrom.value?.type === 'PRODUCTS') {
      this.buildDefChart(payload, filterDate);
    }
    else {
      this.buildRemitanceChart(payload);
    }
  }
  buildDefChart(payload: any[], filterDate: string) {

    const segregatedData: { [key: string]: { [key: string]: number } } = {};

    // Segregate data by date and categories
    Object.entries(payload).forEach(([date, categories]: [string, any]) => {
      segregatedData[date] = categories as { [key: string]: number };
    });

    // const labels = filterDate ? [filterDate] : Object.keys(segregatedData).map(m => this.dateFormaterService.formateMothAndYear(m));
    const labels = filterDate ? [filterDate] : Object.keys(segregatedData);
    const allCategories = new Set<string>();

    // Collect all unique categories
    Object.values(segregatedData).forEach((categories) => {
      Object.keys(categories).forEach((category) => allCategories.add(category));
    });
    debugger

    const datasets = Array.from(allCategories).map((category) => {
      return {
        label: category,
        data: labels.map((label) => segregatedData[label]?.[category] || 0),
        backgroundColor: labels.map(() => this.generateUniqueColor(category)),
      };
    });

    this.dataset = {
      labels: labels.map(m => this._dateFormaterService.formateMothAndYear(m)),
      datasets: datasets,
    };

    this.createChart();
  }
  buildRemitanceChart(payload: any[]) {

    const segregatedData: { [key: string]: { [key: string]: number } } = {};

    // Segregate data by date and categories
    Object.entries(payload).forEach(([date, categories]: [string, any]) => {
      segregatedData[date] = categories as { [key: string]: number };
    });

    const labels = new Set<string>();
    const allCategories = Object.keys(segregatedData);
    // const labels = Object.keys(segregatedData);
    // const allCategories = new Set<string>();

    // Collect all unique categories
    Object.values(segregatedData).forEach((categories) => {
      Object.keys(categories).forEach((category) => labels.add(category));
    });
    debugger

    // const datasets = Array.from(allCategories).map((category) => {
    //   const datasets = Array.from(labels).map((label) => {
    //   return {
    //     label: label,
    //     data: allCategories.map((data) => segregatedData[data]?.[label] || 0),
    //     backgroundColor: allCategories.map(() => this.generateUniqueColor(label)),
    //   };
    // });
    const datasets = allCategories.map((cat) => {
      return {
        label: cat,
        data: [...labels].map(lb => segregatedData[cat][lb]),
        backgroundColor: this.generateUniqueColor(cat),
      };
    });
    const bng = [...labels].map(name => name === 'RESERVE' ? 'রিজার্ভ' : name === 'REMITTANCE' ? 'রেমিট্যান্স' : name);
    this.dataset = {
      labels: bng,
      datasets: datasets,
    };

    this.createChart();
  }

  createChart() {
    // const chartType: ChartType = 'line';
    const title = (this.economicFrom?.get('compareBy')?.value === 'MONTHLY') ? 'মাসভিত্তিক তুলনা'
      : (this.economicFrom?.get('compareBy')?.value === 'YEARLY') ? 'বছরভিত্তিক তুলনা' : 'সাপ্তাহিক তুলনা';

    this._chartService.createChart(
      document.getElementById('chart-economic') as HTMLCanvasElement,
      this.economicFrom?.get('chartType')?.value,
      this.dataset.labels,
      this.dataset?.datasets,
      title,
      'chart-compare',
      this.typeOfForm() === 'PRODUCTS' ? 'দাম' : 'বিলিয়ান ডলার'
    );
  }

  generateUniqueColor(category: string): string {
    const hash = Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const r = (hash * 137) % 255;
    const g = (hash * 149) % 255;
    const b = (hash * 163) % 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      console.log('Error in response:', res);
      return;
    }
    else if (res.header.referance === 'SEARCH') {
      this.buildChart(res.payload as Array<any>);
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log('error', res);
  }

}
