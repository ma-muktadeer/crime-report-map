import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import { ChartService } from '../chart.service';
import { CommonSearchRepComponent } from '../common-search-rep/common-search-rep.component';

@Component({
  selector: 'app-timely-chart',
  imports: [CommonSearchRepComponent, BaseChartDirective],
  templateUrl: './timely-chart.component.html',
  styleUrls: ['./timely-chart.component.scss']
})
export class TimelyChartComponent extends CommonSearchRepComponent implements AfterViewInit {
  reportType: string = 'CRIME';

  chartService = inject(ChartService);
  dateFormaterService = inject(DateFormatterService);
  dataset: any;
  formValue: any;
  isDownload = signal<boolean>(false);

  override ngOnInit() {
    // this.onSubmit();
  }

  ngAfterViewInit() {
    // this.createChart();
  }


  searchValue(event: any) {
    this.formValue = event;
    debugger
    this.cs.sendRequestAdmin(this, ActionType.SEARCH, ContentType.VwCrimeInfo, 'SEARCH', this.formValue);
  }

  createChart() {
    const title = `${this.dateFormaterService.formatFrom2To(this.formValue.fromDate, this.formValue.toDate)}`;

    // Ensure the chart instance is properly destroyed before creating a new one
    this.chartService.createChart(
      document.getElementById('chart') as HTMLCanvasElement,
      this.formValue?.chartType,
      this.dataset.labels,
      this.dataset?.datasets,
      title,
      'chart'
    );
  }

  generateColors(count: number): string[] {
    return Array.from({ length: count }, (_, i) => `hsl(${(360 / count) * i}, 70%, 50%)`);
  }


  buildChart(payload: any[]) {
    this.isDownload.set(true);
    // Filter out items with a count of 0
    const filteredPayload = payload.filter(item => item.count > 0);

    const backgroundColors = this.generateColors(filteredPayload.length);

    // const labels = ['অপরাধ'];
    const labels = [
      this.formValue.type==='POLITICAL' ? 'রাজনৈতিক' : this.formValue.type === 'CRIME' ? 'কর্মসূচি' : '',
    ];

    const datasets = filteredPayload.map((item, index) => ({
      label: item.name,
      data: [item.count || 0],
      backgroundColor: backgroundColors[index],
    }));

    this.dataset = {
      labels: labels,
      datasets: datasets,
    };

    this.createChart();
  }


  downloadChart() {
    const chartContainer = document.getElementById('chart')?.parentElement;
    if (chartContainer) {
      this.chartService.downloadChartAsPDF(chartContainer, 'timely-chart.pdf');
    } else {
      console.error('Chart container not found.');
    }
  }

  override onResponse(service: Service, req: any, res: any): void {
    debugger
    if (!super.isOK(res)) {
      console.error('Error:', super.getErrorMsg(res));
      return;
    }

    if (res.header.referance === 'SEARCH') {
      console.log('Search results:', res.payload);
      this.searchForm.get('typeOfCrimeIdList')?.setValue([]);
      this.buildChart(res.payload);
    }

  }

  override onError(service: Service, req: any, res: any): void {
    console.error('An error occurred:', res);
  }
}
