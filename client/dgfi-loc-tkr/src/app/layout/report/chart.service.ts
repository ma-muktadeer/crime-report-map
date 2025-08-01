import { inject, Injectable } from '@angular/core';
import { Chart, ChartType, Plugin, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  dateFormaterService = inject(DateFormatterService);

  private chartInstance: Chart | null = null;

  transposeData(originalData: any[]): any[] {
    if (originalData.length === 0 || originalData[0].data.length === 0) {
      return []; // যদি ডেটা খালি হয়, খালি অ্যারে ফেরত দিন
    }

    const originalRows = originalData.length; // dt.length
    const originalCols = originalData[0].data.length; // dt[0].data.length

    const transposedData: any[] = [];

    // নতুন কাঠামো অনুযায়ী ডেটা তৈরি করুন
    for (let col = 0; col < originalCols; col++) {
      const newDataArray: number[] = [];
      const newBackgroundColors: string[] = [];
      let newLabel = ''; // নতুন লেবেল কি হবে তা নির্ধারণ করতে হবে

      for (let row = 0; row < originalRows; row++) {
        newDataArray.push(originalData[row].data[col]);

        console.log(Array.isArray(originalData[row].backgroundColor));

        if (Array.isArray(originalData[row].backgroundColor)) {
          newBackgroundColors.push(originalData[row].backgroundColor[col]);
        } else {
          newBackgroundColors.push(originalData[row].backgroundColor as string);
        }

        // newBackgroundColors.push(originalData[row].backgroundColor[col]);
        if (row === 0) {
          newLabel = ``;
        }
      }
      transposedData.push({
        label: newLabel,
        data: newDataArray,
        backgroundColor: newBackgroundColors
      });
    }

    return transposedData;
  }
  createChart(
    ctx: HTMLCanvasElement,
    chartType: ChartType,
    labels: string[],
    datasets: { label: string; data: number[]; backgroundColor: string | string[] }[],
    title: string,
    lable: any,
    yLable?: string
  ) {
    if (!ctx) {
      console.error(
        'Failed to create chart: Canvas context is invalid or null.'
      );
      return;
    }

    Chart.register(...registerables);
    console.log('raw dataset is', datasets);


    if (chartType === 'pie' || chartType === 'doughnut') {
      labels = datasets.map(ds => ds.label);
      // datasets = [{
      //   label: title,
      //   data: datasets.map(ds => ds.data[0]),
      //   backgroundColor: datasets.map(ds => ds.backgroundColor as string)
      // }];

      const dt = this.transposeData(datasets);

      console.log('pie is', dt);
      datasets = dt;
    }

    console.log('chart value is', datasets);

    // Plugin to display data values inside the chart
    const dataValuePlugin: Plugin = {
      id: 'dataValuePlugin',
      afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((point, index) => {
            const data = dataset.data[index] as number;
            const label = labels[index] || '';
            // const label = dataset.label || '';
            ctx.save();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.save();

            if (chartType === 'pie' || chartType === 'doughnut') {
              const { x, y } = point.tooltipPosition(true);
              ctx.translate(x, y);
              ctx.fillText(`${this.dateFormaterService.toBengaliNumerals(data.toString())}`, 0, 0);
              // ctx.fillText(`${label}: ${this.dateFormaterService.toBengaliNumerals(data.toString())}`, 0, 0);

              // const { x, y } = point.tooltipPosition(true);
              // ctx.fillText(this.dateFormaterService.toBengaliNumerals(data.toString()), x, y);

            } else if (chartType === 'bar') {
              ctx.translate(point.x, point.y - 10);
              ctx.fillText(
                `${this.dateFormaterService.toBengaliNumerals(
                  data.toString()
                )}`,
                0,
                0
              );
              // ctx.fillText(`${label}: ${data}`, 0, 0);
            } else if (chartType === 'line') {
              const datasetIndex = i; // Use dataset index to stagger values
              const offset =
                (datasetIndex - (chart.data.datasets.length - 1) / 2) * 15; // Stagger values vertically
              ctx.translate(point.x, point.y + offset);
              ctx.fillText(
                `${this.dateFormaterService.toBengaliNumerals(
                  data.toString()
                )}`,
                0,
                0
              );
              // ctx.fillText(`${label}: ${data}`, 0, 0);
            }

            ctx.restore();
          });
        });
      },
    };

    // Destroy existing chart instance if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const yAxisConfig: any = {};
    if (yLable) {
      yAxisConfig.title = {
        display: true,
        text: yLable,
        font: {
          size: 14,
          weight: 'bold',
        },
      };
    }
    yAxisConfig.beginAtZero = true;

    this.chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          title: {
            display: true,
            text: title,
            padding: {
              top: 10,
              bottom: 20,
            },
          },
        },
        scales: {
          y: yAxisConfig,
        },
      },
      plugins: [dataValuePlugin],
    });
  }

  downloadChartAsPDF(
    chartContainer: HTMLElement,
    fileName: string = 'chart.pdf'
  ) {
    if (!chartContainer) {
      console.error(
        'Failed to download chart: Chart container is invalid or null.'
      );
      return;
    }

    html2canvas(chartContainer)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(fileName);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }
}
