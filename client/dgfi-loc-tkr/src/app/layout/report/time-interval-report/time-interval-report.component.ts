import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import { ChartService } from '../chart.service';
import { CommonSearchRepComponent } from "../common-search-rep/common-search-rep.component";

@Component({
  selector: 'app-time-interval-report',
  imports: [CommonSearchRepComponent, BaseChartDirective],
  templateUrl: './time-interval-report.component.html',
  styleUrl: './time-interval-report.component.scss'
})
export class TimeIntervalReportComponent extends CommonSearchRepComponent {
  reportType: string = 'CRIME';

  chartService = inject(ChartService);
  dateFormaterService = inject(DateFormatterService);

  isTimeIntervalBool: WritableSignal<boolean> = signal<boolean>(true);
  isDownload = signal<boolean>(false);

  formValue: any;
  dataset: { labels: any[]; datasets: { label: string; data: any[]; backgroundColor: any; }[]; };


  searchValue(event: any) {
    this.formValue = event;
    this.loadSearchValue(event);
  }

  loadSearchValue(event: any | {} = {}): void {
    if (!event) {
      return;
    }
    else if (event?.timeInterval === 'monthly') {
      this.cs.sendRequestAdmin(this, ActionType.SEARCH_MONTH, ContentType.VwCrimeInfo, 'SEARCH_MONTH', event);
    } else if (event?.timeInterval === 'yearly') {
      this.cs.sendRequestAdmin(this, ActionType.SEARCH_YEARLY, ContentType.VwCrimeInfo, 'SEARCH_MONTH', event);
    }
  }
  buildChart(payload: any[], filterDate?: string) {
    this.isDownload.set(true);
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
      labels: labels.map(m => this.dateFormaterService.formateMothAndYear(m)),
      datasets: datasets,
    };

    this.createChart();
  }

  generateUniqueColor(category: string): string {
    const hash = Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const r = (hash * 137) % 255;
    const g = (hash * 149) % 255;
    const b = (hash * 163) % 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  createChart() {
    // const chartType: ChartType = 'bar';
    const title = this.formValue?.timeInterval === 'monthly' ? 'মাসভিত্তিক তুলনা'
      : this.formValue?.timeInterval === 'yearly' ? 'বছরভিত্তিক তুলনা' : 'Crime Statistics';
    // Ensure the chart instance is properly destroyed before creating a new one

    this.chartService.createChart(
      document.getElementById('chart-interval') as HTMLCanvasElement,
      this.formValue?.chartType,
      this.dataset.labels,
      this.dataset?.datasets,
      title,
      'chart-interval'
    );
  }

  downloadChart() {
    const chartContainer = document.getElementById('chart-interval')?.parentElement;
    if (chartContainer) {
      this.chartService.downloadChartAsPDF(chartContainer, 'timely-chart.pdf');
    } else {
      console.error('Chart container not found.');
    }
  }

  override onResponse(service: Service, req: any, res: any): void {
    debugger
    if (!super.isOK(res)) {
      console.log('Error in response:', res);
      return;
    }
    else if (res.header.referance === ActionType.SEARCH_MONTH) {
      this.buildChart(res.payload as Array<any>);
    }
  }

}
