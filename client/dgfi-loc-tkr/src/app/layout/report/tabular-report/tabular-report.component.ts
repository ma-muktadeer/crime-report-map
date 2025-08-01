import { Component, inject, signal } from '@angular/core';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import { CommonSearchRepComponent } from "../common-search-rep/common-search-rep.component";
import { FormatedTable, HeaderBodyGroup } from './HeaderBodyGroup';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SoftLoadingComponent } from "../../common/soft-loading/soft-loading.component";

@Component({
  selector: 'app-tabular-report',
  imports: [CommonSearchRepComponent, NgxSpinnerModule],
  templateUrl: './tabular-report.component.html',
  styleUrl: './tabular-report.component.scss'
})
export class TabularReportComponent extends CommonSearchRepComponent {
  private readonly _cs = inject(CommonService);
  readonly _dateFormatter = inject(DateFormatterService);
  formValue: any;
  tableValueList = signal<FormatedTable[]>([]);
  loading = signal<boolean>(false);
  // filteredGroups: Array<{ header: any; body: any[] }> = [];

  searchValue(event: any) {
    this.formValue = event;
    if (this.formValue.politicalPartyId != 0) {
      this.formValue['politicalPartyName'] = null;
    }
    else {
      this.formValue['politicalPartyId'] = null;
    }

    this.loading.update(()=>true);
    this._cs.sendRequestAdmin(this, ActionType.TABULAR_SEARCH, ContentType.VwCrimeInfo, 'SEARCH', this.formValue);
  }

  processData(data: HeaderBodyGroup[]) {
    const groupedTables = data.map(group => {
      const headers = Object.keys(group.header);

      if (group.tabularData.length === 0) {
        console.warn(`No tabular data found for group: ${group.title}`);
        return { header: group.header, body: [], title: group.title };
      }
      const body = group.tabularData;

      // const body = group.tabularData.map(row => {
      //   const filteredRow: { [key: string]: any } = {};
      //   headers.forEach(key => {
      //     filteredRow[key] = row[key] ?? '';
      //   });
      //   return filteredRow;
      // });

      return { header: group.header, body, title: group.title };
    });

    console.log('groupedTables', groupedTables);

    this.tableValueList.set(groupedTables);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  exportToPdf() {
    debugger
    var divToPrint = document.getElementById('tableValueCard');
    var newWin = window.open('', 'PrintWindow', 'width=1000,height=650,top=50%,left=50%,toolbars=no,scrollbars=yes,status=no,resizable=yes');
    newWin.document.writeln(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            h5{
              text-align: center;
              margin-bottom: 0px;
            }
            table {
              border-collapse: collapse;
              border: 1px solid black;
              width: 100% !important;
            }
            th {
              background-color: #bdbdbd !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            th, td {
              border: 1px solid black;
              text-align: center;
            }
            .t-wrap{
              word-wrap: break-word;
              width: 50px;
            }
          }
        </style>
      </head>
      <body>
        ${divToPrint.outerHTML}
      </body>
    </html>
  `);
    newWin.print();
    newWin.close();

  }

  override onResponse(service: Service, req: any, res: any): void {
    if (!super.isOK(res)) {
      return;
    }
    else if (res.header.referance === 'SEARCH') {
      debugger
    this.loading.update(()=>false);

      // this.tableValueList.update(res.payload);
      console.log('table value ', res.payload);
      this.processData(res.payload as HeaderBodyGroup[]);
    }
  }
}
