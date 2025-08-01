import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Column, FieldType, Formatter, Pagination } from 'angular-slickgrid';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import { SoftGridModule } from "../../common/soft-grid/soft-grid.module";
import { CustomGridData } from '../../service/CustomGridData';
import { SearchComponent } from "../search/search.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criminal-list',
  imports: [SoftGridModule, SearchComponent],
  templateUrl: './criminal-list.component.html',
  styleUrl: './criminal-list.component.scss'
})
export class CriminalListComponent extends Softcafe implements Service {
  searchForm: any;
  searchTypeName = signal<string>('');


  constructor(private router: Router) {
    super();
  }
  private cs: CommonService = inject(CommonService);
  criminalList = signal<CustomGridData>(null);

  columnDefinitions: Column[] = [];
  

  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="সংশোধন"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="ডিলিট"  style="font-size:14px;"  class="bi bi-trash-fill pointer" aria-hidden="true"></i>'
  };
  pageNumber: number = 1;
  pageSize: number = 20;

  ngOnInit() {
    // this.loadInitValue();
    this.prepareGrid();

  }

  // loadInitValue() {
  //   const payload = {};

  //   this.cs.sendRequestAdmin(this, ActionType.SELECT_ALL, ContentType.VwCrimeInfo, 'SELECT', payload);
  // }

  
  printDetails() {
    
    const divToPrint = document.getElementById('pdf-content');
  
    if (!divToPrint) return;
  
    const newWin = window.open('', 'PrintWindow', 'width=1000,height=650,top=50%,left=50%,toolbars=no,scrollbars=yes,status=no,resizable=yes');
  
    newWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            body {
              font-family: 'kalpurush', sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 4px;
              text-align: left;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          ${divToPrint.innerHTML}
        </body>
      </html>
    `);
  
    // newWin.document.close(); // ডকুমেন্ট লেখা শেষ
    // newWin.focus();
      newWin.print();
      newWin.close();
   
  }
  
  
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} \n${hour}:${minute}`;
  }

  



  serialFormmater: Formatter = (index, a, v, c) => {
    return index + 1 + '';
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'serialKey', name: 'ক্রমিক নম্বর', field: 'serialKey',
        formatter: this.serialFormmater,
        minWidth: 100,
      },
      {
        id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon, minWidth: 20, maxWidth: 50,
        onCellClick: (e, args) => { this.onDeleteCrime(e, args) },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false,
      },
      {
        id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 20, maxWidth: 50,
        onCellClick: (e, args) => { this.onEditCrime(e, args) },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false,
      },
      {
        id: 'stDateTime', name: 'তারিখ ও সময়', field: 'stDateTime',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 150,
      },
      {
        id: 'crimeType', name: 'বিষয়', field: 'crimeType',
        sortable: true, reorderable: true, type: FieldType.text,
        filterable: true, minWidth: 250,
      },

      {
        id: 'divisionName', name: 'বিভাগের নাম', field: 'divisionName',
        sortable: true, reorderable: true, type: FieldType.text,
        filterable: true, minWidth: 120,
      },
      {
        id: 'districtName', name: 'জেলার নাম', field: 'districtName',
        sortable: true, reorderable: true, type: FieldType.text,
        filterable: true, minWidth: 120,
      },
      {
        id: 'criminalDetails', name: 'মূলহোতা', field: 'criminalDetails',
        sortable: true, reorderable: true, type: FieldType.text,
        filterable: true, minWidth: 250,
      },
      {
        id: 'victimDetails', name: 'ভিক্টিম', field: 'victimDetails',
        sortable: true, reorderable: true, type: FieldType.text,
        filterable: true, minWidth: 250,
      },
      // {
      //   id: 'victimIdentity', name: 'ভিক্টিমের পরিচয় পদ', field: 'victimIdentity',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 250,
      // },
      // {
      //   id: 'victimPoliticalPartyName', name: 'ভিক্টিমের রাজনৈতিক দলের নাম', field: 'victimPoliticalPartyName',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 250,
      // },
      // {
      //   id: 'victimReligious', name: 'ভিক্টিম ধর্মীয় সামাজিক আন্দোলন কৃত', field: 'victimReligious',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 150,
      // },
      // {
      //   id: 'criminalName', name: 'অপরাধীর নাম', field: 'criminalName',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 250,
      // },
      // {
      //   id: 'criminalIdentity', name: 'অপরাধীর পরিচয় পদ', field: 'criminalIdentity',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 250,
      // },
     
      {
        id: 'partyName', name: 'দল', field: 'partyName',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 120,
      },

     
      {
        id: 'locationName', name: 'স্থান', field: 'locationName',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 150,
      },
      {
        id: 'legalAdminAction', name: 'আইনগত / প্রশাসনিক ব্যবস্থা', field: 'legalAdminAction',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 150,
      },

      // {
      //   id: 'upazilaName', name: 'উপজেলার নাম', field: 'upazilaName',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 120,
      // },
      {
        id: 'organizationName', name: 'প্রতিষ্ঠানের নাম', field: 'organizationName',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 250,
      },
      {
        id: 'overView', name: 'সংক্ষিপ্ত বিবরণ', field: 'overView',
        sortable: true, type: FieldType.text,
        filterable: true, minWidth: 250,
      },
      // {
      //   id: 'latitude', name: 'অক্ষাংশ', field: 'latitude',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 100,
      // },
      // {
      //   id: 'longitude', name: 'দ্রাঘিমাংশ', field: 'longitude',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, minWidth: 100,
      // },

    ];
  }

  onEditCrime(event: Event, args: any) {
    debugger
    const crime = args.dataContext;
    const type = crime.type;
    //const crimeId = crime.id;
    const crimeId = crime.crimeId;

    if (type === 'POLITICAL') {
      this.router.navigate(['/dgfi/political'], {
        state: { id: crimeId }
      });
    } else if (type === 'CRIME') {
      this.router.navigate(['/dgfi/add'], {
        state: { id: crimeId }
      });
    } else {
      console.error('Unknown crime type:', type);
    }
  }
  onDeleteCrime(event: Event, args: any) {
    debugger
    const crime = args.dataContext;
    const crimeId = crime.crimeId;
    if(crimeId){
      Swal.fire({
        icon: 'warning',
        title: 'সতর্কতা',
        text: 'আপনি কি তথ্যটি মুছে ফেলতে চান?',
        showConfirmButton: true,
        confirmButtonText:'মুছে ফেলুন',
        showCancelButton: true,
        cancelButtonText:'না'
      }).then(res=>{
        if(res.isConfirmed){
          debugger
          const payload = {
            crimeId: crimeId,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            ...this.searchForm,
          }

          this.cs.sendRequest(this, ActionType.DELETE, ContentType.VwCrimeInfo, 'SELECT', payload);
        }
      });
    }
  }


  paginationChanged($event: any) {
    this.pageNumber = $event.pageNumber;
    this.pageSize = $event.pageSize;
    this.searchList();
  }

  searchList(event?: any) {
    if (event) {
      this.searchForm = event;
    }
    else {
      event = this.searchForm;
    }
    // this.pageNumber = 1;
    // this.pageSize = 20;


    const searchType = event?.type || null; 
  debugger
  if (searchType === 'CRIME') {
    this.searchTypeName.update(() =>'আইন-শৃঙ্খলা জনিত ঘটনা');
  }

  else if (searchType === 'POLITICAL') {
    this.searchTypeName.update(() =>'রাজনৈতিক');
  }



    debugger
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      ...event,
    }

    this.cs.sendRequestAdmin(this, ActionType.SELECT_ALL, ContentType.VwCrimeInfo, 'SELECT', payload);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      console.log('getting error', super.getErrorMsg(res));
      return;
    }
    if (res.header.referance == 'SELECT') {
      console.log(res.payload);
      const gridData: CustomGridData = {
        content: res.payload.content,
        total: res.payload.page.totalElements,
        totalPages: res.payload.page.totalPages,
        pageSize: this.pageSize
      };
      this.criminalList.update(() => gridData);
    }

  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
