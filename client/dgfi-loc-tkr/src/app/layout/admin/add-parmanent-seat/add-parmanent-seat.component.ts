import { AbstractControl, FormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { SoftGridModule } from '../../common/soft-grid/soft-grid.module';
import {
  Column,
  FieldType,
  Filters,
  Formatter,
  Pagination,
} from 'angular-slickgrid';
import { CustomGridData } from '../../service/CustomGridData';
import { SoftLoadingComponent } from '../../common/soft-loading/soft-loading.component';

@Component({
  selector: 'app-add-parmanent-seat',
  imports: [NgClass, FormsModule, SoftGridModule, SoftLoadingComponent],
  templateUrl: './add-parmanent-seat.component.html',
  styleUrl: './add-parmanent-seat.component.scss',
})
export class AddParmanentSeatComponent extends Softcafe implements Service {
  seatList = signal<any[]>([]);

  divisionList = signal<any[]>([]);
  districtList = signal<any[]>(null);
  submitted = signal<boolean>(false);
  showGrid = signal<boolean>(false);

  columnDefinitions: Column[] = [];
  dataset = signal<CustomGridData>(null);
  total: number = 300;
  totalPages: number = 20;
  pageSize: number = 20;

  constructor(private cs: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.loadInitLocation();
    this.loadSeatList();
    this.prepareGrid();
  }

  prepareGrid() {
    if (this.cs.forceAllow()) {
      this.columnDefinitions = this.colDef;
    }

    this.columnDefinitions = this.colDef;
  }

  viewIcon: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    return '<i title="দেখুন"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>';
  };
  deleteIcon: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    return '<i title="ডিলিট"  style="font-size:14px;"  class="fa fa-trash pointer" aria-hidden="true"></i>';
  };
  editIcon: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    return '<i title="সংশোধন"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>';
  };
  callPagination: boolean = false;
  paginationChanged(event: any) {
    if (this.callPagination) {
      return;
    }
    this.callPagination = true;
    console.log('pagenation ', event);
    this.loadSeatList(event as Pagination);
  }

  onEditFinancial(e: any, args: any) {
    const item = args.dataContext;
    console.log('Edit item:', item);

    this.idLocationKey.update(() => item.idLocationKey);
    this.districtId.update(() => item.districtId);
    this.divisionId.update(() => item.divisionId);
    this.locationNameBn.update(() => item.locationNameBn);
  }

  buildUserDataset() {
    if (!this.showGrid()) {
      this.showGrid.update(() => true);
    }

    let dt: CustomGridData = {
      content: this.seatList(),
      total: this.total,
      totalPages: this.totalPages,
      pageSize: this.pageSize,
    };
    this.dataset.set(dt);
    console.log('financial list ', this.dataset());

    this.resetValue();
  }

  resetValue() {
    this.districtId.update(() => null);
    this.divisionId.update(() => null);
    this.locationNameBn.update(() => null);
    this.idLocationKey.update(() => null);
  }

  onDeleteFinancial(e: any, args: any) {
    const item = args.dataContext;
    console.log('Delete item:', item);

    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপনি কি এই তথ্যটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'না, বাতিল করুন',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          idLocationKey: item.idLocationKey,
        };

        this.cs.sendRequestAdmin(
          this,
          ActionType.DELETE,
          ContentType.CrimeChart,
          'LOAD',
          payload
        );
      }
    });
  }
  colDef: Column[] = [
    {
      id: 'edit',
      name: '',
      field: 'edit',
      formatter: this.editIcon,
      minWidth: 20,
      maxWidth: 50,
      onCellClick: (e, args) => {
        this.onEditFinancial(e, args);
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false,
    },
    {
      id: 'delete',
      name: '',
      field: 'delete',
      formatter: this.deleteIcon,
      minWidth: 20,
      maxWidth: 50,
      toolTip: 'Delete User',
      onCellClick: (e, args) => {
        this.onDeleteFinancial(e, args);
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false,
    },
    {
      id: 'districtName',
      name: 'জেলার নাম',
      field: 'districtName',
      sortable: true,
      type: FieldType.text,
      minWidth: 140,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'locationNameBn',
      name: 'আসনের নাম',
      field: 'locationNameBn',
      sortable: true,
      type: FieldType.text,
      minWidth: 140,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
  ];

  idLocationKey = signal<number>(null);
  divisionId = signal<number>(null);
  districtId = signal<number>(null);
  locationNameBn = signal<string>(null);
  // set idLocationKey(id: number) {
  //   this.idLocationKey = id;
  // }

  // get idLocationKey() {
  //   return this.idLocationKey;
  // }
  // set divisionId(id: number) {
  //   this.divisionId = id;
  // }

  // get divisionId() {
  //   return this.divisionId;
  // }
  // set districtId(id: number) {
  //   this.districtId = id;
  // }

  // get districtId() {
  //   return this.districtId;
  // }
  // set locationNameBn(id: string) {
  //   this.locationNameBn = id;
  // }

  // get locationNameBn() {
  //   return this.locationNameBn;
  // }

  loadSeatList(value?: Pagination) {
    const payload = {
      pageSize: this.pageSize,
      locationType: 'PARLIAMENTARY_SEAT',
      ...value,
    };
    this.cs.sendRequest(
      this,
      ActionType.LOAD_EXTRA,
      ContentType.CrimeChart,
      'LOAD',
      payload
    );
  }
  loadInitLocation() {
    const payload = {
      locationType: 'Division',
      parentKey: 73,
    };
    this.sendRequest(payload, 'SELECT_DIVISION');
  }

  loadLocation(event: any, locationType: string, ref: string) {
    if (locationType == 'District') {
      this.districtId.update(() => null);
      this.divisionId.update(() => event.target.value);
      debugger;
      const payload = {
        locationType: locationType,
        // locationType: 'District',
        parentKey: event.target.value,
      };
      this.sendRequest(payload, ref);
    } else if (locationType == 'Thana') {
      this.districtId.update(() => event.target.value);
    }
  }

  sendRequest(payload: any, ref: string) {
    this.cs.sendRequestAdmin(
      this,
      ActionType.SELECT,
      ContentType.CrimeChart,
      ref,
      payload
    );
  }

  onSave() {
    const payload = {
      idLocationKey: this.idLocationKey(),
      locationType: 'PARLIAMENTARY_SEAT',
      parentKey: this.districtId(),
      locationNameBn: this.locationNameBn(),
    };

    debugger;

    this.submitted.update(() => true);

    if (
      !this.checkField(
        payload.parentKey,
        'district নির্ধারিত নয়!',
        'অনুগ্রহ করে একটি সঠিক district নির্বাচন করুন।'
      )
    ) {
      return;
    }
    // if (!this.checkField(payload.locationType, 'অপরাধের ধরন নির্ধারিত নয়!', 'অনুগ্রহ করে একটি অপরাধের ধরন নির্বাচন করুন।')) return;
    if (
      !this.checkField(
        payload.locationNameBn,
        'বিভাগ নির্ধারিত নয়!',
        'অনুগ্রহ করে একটি বিভাগ নির্বাচন করুন।'
      )
    ) {
      return;
    }
    // if (!this.checkField(payload.districtId, 'বিভাগ নির্ধারিত নয়!', 'অনুগ্রহ করে একটি জেলা নির্বাচন করুন।')) return;

    this.cs.sendRequest(
      this,
      ActionType.SAVE,
      ContentType.CrimeChart,
      'LOAD',
      payload
    );
  }

  checkField(value: any, title: string, text: string): boolean {
    if (!value) {
      Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        confirmButtonText: 'ঠিক আছে',
      });
      return false;
    }
    return true;
  }

  onResponse(service: Service, req: any, res: any) {
    debugger;
    if (!super.isOK(res)) {
      // Swal.fire({
      //   title: 'Error',
      //   icon: 'error',
      //   text: super.getErrorMsg(res),
      //   timer: 2000,
      // });
      return;
    } else if (res.header.referance == 'SELECT_DIVISION') {
      console.log(res.payload);
      this.divisionList.set(res.payload);
    } else if (res.header.referance == 'SELECT_DISTRICT') {
      console.log(res.payload);
      this.districtList.set(res.payload);
    } else if (res.header.referance == 'LOAD') {
      this.submitted.update(() => false);
      this.callPagination = false;
      console.log(res.payload);
      this.seatList.set(res.payload);
      this.buildUserDataset();
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
