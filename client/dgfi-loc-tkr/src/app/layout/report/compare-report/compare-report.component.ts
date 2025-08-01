import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import { ChartService } from '../chart.service';
import { CommonSearchRepComponent } from "../common-search-rep/common-search-rep.component";

@Component({
  selector: 'app-compare-report',
  imports: [CommonSearchRepComponent, BaseChartDirective],
  templateUrl: './compare-report.component.html',
  styleUrl: './compare-report.component.scss'
})
export class CompareReportComponent extends CommonSearchRepComponent {
  reportType: string = 'CRIME';
  dateFormaterService= inject(DateFormatterService);
  isCompareByBool: WritableSignal<boolean> = signal<boolean>(true);

  chartService = inject(ChartService);
  formValue: any;

  dataset: { labels: any[]; datasets: { label: string; data: any[]; backgroundColor: any; }[]; };
  isDownload = signal<boolean>(false);


  searchValue(event: any) {
    this.formValue = event;
    this.loadSearchValue(event);
  }

  loadSearchValue(event: any | {} = {}): void {
    if (!event) {
      return;
    }
    else if (event?.compareBy === 'monthly') {
      this.cs.sendRequestAdmin(this, ActionType.SEARCH_MONTHLY_COMPARE, ContentType.VwCrimeInfo, 'SEARCH', event);
    } else if (event?.compareBy === 'yearly') {
      this.cs.sendRequestAdmin(this, ActionType.SEARCH_YEARLY_COMPARE, ContentType.VwCrimeInfo, 'SEARCH', event);
    }
  }
  buildChart(payload: Array<any>, filterDate?: string) {
    this.isDownload.set(true);
    const segregatedData: { [key: string]: { [key: string]: number } } = {};

    // Segregate data by date and categories
    Object.entries(payload).forEach(([date, categories]: [string, any]) => {
      segregatedData[date] = categories as { [key: string]: number };
    });

    const labels = filterDate ? [filterDate] : Object.keys(segregatedData);
    const allCategories = new Set<string>();

    // Collect all unique categories
    Object.values(segregatedData).forEach((categories) => {
      Object.keys(categories).forEach((category) => allCategories.add(category));
    });

    const datasets = Array.from(allCategories).map((category) => {
      return {
        label: this.dateFormaterService.formateMothAndYear(category),
        data: labels.map((label) => segregatedData[label]?.[category] || 0),
        backgroundColor: labels.map(() => this.generateUniqueColor(category)),
      };
    });

    this.dataset = {
      labels: labels,
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
    // const chartType: ChartType = 'line';
    const title = this.formValue?.compareBy === 'monthly' ? 'মাসভিত্তিক তুলনা'
    : this.formValue?.compareBy === 'yearly' ? 'বছরভিত্তিক তুলনা' : 'অপরাধের তুলনা';
  

    this.chartService.createChart(
      document.getElementById('chart-compare') as HTMLCanvasElement,
      this.formValue?.chartType,
      this.dataset.labels,
      this.dataset?.datasets,
      title,
      'chart-compare'
    );
  }

  downloadChart() {
    const chartContainer = document.getElementById('chart-compare')?.parentElement;
    if (chartContainer) {
      this.chartService.downloadChartAsPDF(chartContainer, 'compare-chart.pdf');
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
    else if (res.header.referance === 'SEARCH') {
      this.buildChart(res.payload as Array<any>);
    }
  }

}
