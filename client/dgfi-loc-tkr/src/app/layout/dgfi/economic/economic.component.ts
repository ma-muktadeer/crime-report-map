import { CommonModule, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  Formatter,
  GridOption,
  MenuCommandItem,
  Pagination,
  PaginationService,
} from 'angular-slickgrid';
import { Modal } from 'bootstrap';
import { forkJoin } from 'rxjs';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { SoftGridModule } from '../../common/soft-grid/soft-grid.module';
import { SoftLoadingComponent } from '../../common/soft-loading/soft-loading.component';
import { CustomGridData } from '../../service/CustomGridData';
import { BanglaToEnglishDirective } from '../../service/numaric-input';

@Component({
  selector: 'app-economic',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    SoftLoadingComponent,
    CommonModule,
    SoftGridModule,BanglaToEnglishDirective
  ],
  templateUrl: './economic.component.html',
  styleUrl: './economic.component.scss',
})
export class EconomicComponent
  extends Softcafe
  implements OnInit, Service, AfterViewInit, OnDestroy
{
  isConfirmed = signal<boolean>(false);

  @ViewChild('staticBackdrop') modalElement!: ElementRef;
  contextMenu: MenuCommandItem[] = [];
  columns: Array<any>;
  manageRoleBtnDisabled: boolean;
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number;
  callPagination: boolean = false;
  totalPages: any;
  loading = signal<boolean>(false);
  showGrid = false;
  public paginationService: PaginationService;
  financialList: Array<any> = [];

  columnDefinitions = signal<Column[]>([]);
  gridOptions: GridOption = {};
  dataset = signal<CustomGridData>(null);
  // dataset: Observable<CustomGridData> = of();
  angularGrid: AngularGridInstance;
  gridObj;
  actionColumnWidth = 10;
  isReadOnly = signal<boolean>(false);

  readonly _cs = inject(CommonService);
  private modalInstance!: Modal;
  economicFrom: FormGroup = new FormGroup({});
  typeOfForm = signal<string>(null);
  productsName = signal<any[]>([]);
  productsUnitName = signal<any[]>([]);
  inputField: string;
  h1: string;
  configSubGroup: string;
  configGroup: string;
  types: { id: number; name: string; value: string }[] = [
    { id: 1, name: 'পণ্য', value: 'PRODUCTS' },
    { id: 2, name: 'রেমিট্যান্স', value: 'REMITTANCE' },
    { id: 3, name: 'রিজার্ভ', value: 'RESERVE' },
  ];
  readonly _unit: { id: number; name: string; value: string }[] = [
    { id: 1, name: 'মার্কিন ডলার', value: 'USD' },
    { id: 2, name: 'টাকা', value: 'BDT' },
  ];
  readonly _productUnit: { id: number; name: string; value: string }[] = [
    { id: 1, name: 'মার্কিন ডলার', value: 'USD' },
    { id: 2, name: 'টাকা', value: 'BDT' },
  ];
  isClick = signal<boolean>(false);
  value1: any;

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }
  ngOnInit(): void {
    // this.prepareGrid();
    // this.loadFinancial();
  }
  paginationChanged(event: any) {
    if (this.callPagination) {
      return;
    }
    this.callPagination = true;
    console.log('pagenation ', event);
    this.loadFinancial(event as Pagination);
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  closeModal() {
    debugger;
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  saveType() {
    if (!this.value1 || this.isClick()) {
      return;
    }
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপনি কি তথ্যটি সংরক্ষণ করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, সংরক্ষণ করুন',
      cancelButtonText: 'না, বাতিল করুন',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isClick.update(() => true);
        const payload: any = {
          value1: this.value1,
          configGroup: this.configGroup,
          configSubGroup: this.configSubGroup,
        };
        this._cs.sendRequestAdmin(
          this,
          ActionType.NEW,
          ContentType.SConfiguration,
          'SAVE',
          payload
        );
      }
    });
  }
  type: string = '';

  changeType(type: string, isReadOnly: boolean = false) {
    debugger
    this.isClick.update(() => false);
    this.isReadOnly.update(() => isReadOnly);
    console.log('type', type);

    this.typeOfForm.update(() => type);

    this.buildForm(type);

    this.prepareGrid();
    this.loadFinancial();
  }
  buildForm(type: string) {
    this.type = type
    if (type == 'PRODUCTS') {
      this.loadInit();
      this.economicFrom = this.buildForm4Products(type);
    } else {
      this.economicFrom = this.buildForm4Others(type);
    }
  }

  openModal(
    configGroup: string,
    configSubGroup: string,
    h1: string,
    inputField: string
  ) {
    if (this.modalInstance) {
      this.h1 = h1;
      this.inputField = inputField;
      this.configGroup = configGroup;
      this.configSubGroup = configSubGroup;
      this.modalInstance.show();
    }
  }

  loadInit() {
    forkJoin([this.loadProducts(), this.loadProductsUnits()]).subscribe(
      (res: any) => {
        this.productsName.update(() => res[0].payload);
        this.productsUnitName.update(() => res[1].payload);
      }
    );
  }

  loadProducts() {
    const payload = {
      configGroup: 'PRODUCTS_NAME_GROUP',
      configSubGroup: 'PRODUCTS_NAME_SUB_GROUP',
    };

    return this._cs.execute(
      ActionType.LOAD_PRODUCTS_NAME,
      ContentType.SConfiguration,
      payload
    );
    // this._cs.sendRequest(this, ActionType.LOAD_PRODUCTS_NAME, ContentType.SConfiguration, 'LOAD_PRODUCTS_NAME', payload);
  }
  loadProductsUnits() {
    const payload = {
      configGroup: 'PRODUCTS_UNIT_GROUP',
      configSubGroup: 'PRODUCTS_UNIT_SUB_GROUP',
    };

    return this._cs.execute(
      ActionType.LOAD_PRODUCTS_NAME,
      ContentType.SConfiguration,
      payload
    );
  }

  buildForm4Others(type: string): FormGroup<any> {
    return new FormGroup({
      finincialId: new FormControl(null),
      dttDate: new FormControl(null, [Validators.required]),
      unit: new FormControl('USD', [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      type: new FormControl(type),
    });
  }
  buildForm4Products(type: string): FormGroup<any> {
    return new FormGroup({
      finincialId: new FormControl(null),
      dttDate: new FormControl(null, [Validators.required]),
      idProductName: new FormControl(null, [Validators.required]),
      idUnitName: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      unit: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      type: new FormControl(type),
    });
  }

  onSave() {
    if (this.isConfirmed()) {
      return;
    }
    this.isClick.update(() => true);
    if (this.economicFrom.invalid) {
      return;
    }

    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপনি কি তথ্যটি সংরক্ষণ করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, সংরক্ষণ করুন',
      cancelButtonText: 'না, বাতিল করুন',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isConfirmed.update(() => true);
        this.typeOfForm.update(() => null);
        const payload = this.economicFrom.value;
        console.log(payload);
        const action = payload.finincialId
          ? 'UPDATE_ECONOMIC'
          : 'SAVE_ECONOMIC';
        this._cs.sendRequestAdmin(
          this,
          ActionType.NEW,
          ContentType.Finincial,
          action,
          payload
        );
      }
    });
  }
  search() {
    const payload = this.economicFrom.value;

    this._cs.sendRequestAdmin(
      this,
      ActionType.SELECT,
      ContentType.Finincial,
      'select',
      payload
    );
  }

  loadFinancial(pagination?: Pagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    var payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
      type: this.typeOfForm(),
    };
    this.loading.set(true);

    this._cs.sendRequestAdmin(
      this,
      ActionType.SELECT,
      ContentType.Finincial,
      'select',
      payload
    );
  }

  prepareGrid() {
    // if (this._cs.forceAllow()) {
    //   this.columnDefinitions = this.colDef;
    // }

    // this.columnDefinitions = this.colDef;

    if (this.typeOfForm() === 'PRODUCTS') {
      this.columnDefinitions.update(() => this.podColDef);
    } else {
      this.columnDefinitions.update(() => this.colDef);
    }
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

  serialFormmater: Formatter = (index, a, v, c) => {
    console.log(index, a, v, c);
    return index + 1 + '';
  };
  podColDef: Column[] = [
    {
      id: 'view',
      name: '',
      field: 'view',
      formatter: this.viewIcon,
      minWidth: 25,
      width: this.actionColumnWidth,
      maxWidth: 50,
      onCellClick: (e, args) => {
        this.onViewFinancial(e, args);
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
      id: 'edit',
      name: '',
      field: 'edit',
      formatter: this.editIcon,
      minWidth: 20,
      width: this.actionColumnWidth,
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
      width: this.actionColumnWidth,
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
      id: 'serialKey',
      name: 'ক্রমিক নম্বর',
      field: 'serialKey',
      excludeFromColumnPicker: true,
      excludeFromExport: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      resizable: true,
      focusable: false,
      selectable: false,
      formatter: this.serialFormmater,
      minWidth: 30,
    },
    {
      id: 'stDate',
      name: 'তারিখ',
      field: 'stDate',
      sortable: true,
      type: FieldType.text,
      minWidth: 150,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'decPrice',
      name: 'দাম',
      field: 'decPrice',
      sortable: true,
      type: FieldType.text,
      minWidth: 100,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'decQuantity',
      name: 'পরিমাণ',
      field: 'decQuantity',
      sortable: true,
      type: FieldType.text,
      minWidth: 100,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    // {
    //   id: 'txType',
    //   name: 'লেনদেনের ধরন',
    //   field: 'txType',
    //   sortable: true,
    //   type: FieldType.text,
    //   minWidth: 130,
    //   filterable: true,
    //   filter: { model: Filters['inputText'] },
    // },
    {
      id: 'txUnit',
      name: 'মুদ্রা',
      field: 'txUnit',
      sortable: true,
      type: FieldType.text,
      minWidth: 130,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'txProductName',
      name: 'পণ্যের নাম',
      field: 'txProductName',
      sortable: true,
      type: FieldType.text,
      minWidth: 180,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'txProductUnitName',
      name: 'পরিমাপের একক',
      field: 'txProductUnitName',
      sortable: true,
      type: FieldType.text,
      minWidth: 180,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
  ];
  colDef: Column[] = [
    {
      id: 'view',
      name: '',
      field: 'view',
      formatter: this.viewIcon,
      minWidth: 25,
      width: this.actionColumnWidth,
      maxWidth: 50,
      onCellClick: (e, args) => {
        this.onViewFinancial(e, args);
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
      id: 'edit',
      name: '',
      field: 'edit',
      formatter: this.editIcon,
      minWidth: 20,
      width: this.actionColumnWidth,
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
      width: this.actionColumnWidth,
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
      id: 'serialKey',
      name: 'ক্রমিক নম্বর',
      field: 'serialKey',
      excludeFromColumnPicker: true,
      excludeFromExport: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      resizable: true,
      focusable: false,
      selectable: false,
      formatter: this.serialFormmater,
      minWidth: 30,
    },
    {
      id: 'stDate',
      name: 'তারিখ',
      field: 'stDate',
      sortable: true,
      type: FieldType.text,
      minWidth: 150,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'decPrice',
      name: 'পরিমান',
      field: 'decPrice',
      sortable: true,
      type: FieldType.text,
      minWidth: 100,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
    {
      id: 'txUnit',
      name: 'মুদ্রা',
      field: 'txUnit',
      sortable: true,
      type: FieldType.text,
      minWidth: 130,
      filterable: true,
      filter: { model: Filters['inputText'] },
    },
  ];

  buildUserDataset() {
    if (!this.showGrid) {
      this.showGrid = true;
    }

    let dt: CustomGridData = {
      content: this.financialList,
      total: this.total,
      totalPages: this.totalPages,
      pageSize: this.pageSize,
    };
    this.dataset.set(dt);
    console.log('financial list ', this.dataset());
  }
  onDeleteFinancial(e: any, args: any) {
    debugger
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
        debugger
        const payload = {
          finincialId: item.finincialId,
        };

        this._cs.sendRequestAdmin(
          this,
          ActionType.DELETE,
          ContentType.Finincial,
          'DELETE_ECONOMIC',
          payload
        );
      }
    });
  }

  onViewFinancial(e: any, args: any) {
    const item = args.dataContext;
    console.log('View item:', item);
    this.changeType(item.txType, true);

    setTimeout(() => {
      this.economicFrom.patchValue({
        finincialId: item.financialId,
        dttDate: this.formatDateForInput(item.dttDate),
        unit: item.txUnit,
        price: item.decPrice,
        type: item.txType,
      });

      if (item.txType === 'PRODUCTS') {
        this.economicFrom.patchValue({
          idProductName: item.idProductName,
          idUnitName: item.idUnitName,
          quantity: item.decQuantity,
        });
      }

      this.economicFrom.disable();
    }, 100);
  }

  onEditFinancial(e: any, args: any) {
    const item = args.dataContext;
    console.log('Edit item:', item);

    this.changeType(item.txType);

    setTimeout(() => {
      this.economicFrom.patchValue({
        finincialId: item.financialId,
        dttDate: this.formatDateForInput(item.dttDate),
        unit: item.txUnit,
        price: item.decPrice,
        type: item.txType,
      });

      if (item.txType === 'PRODUCTS') {
        this.economicFrom.patchValue({
          idProductName: item.idProductName,
          idUnitName: item.idUnitName,
          quantity: item.decQuantity,
        });
      }
    }, 100);
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  }

  onResponse(service: Service, req: any, res: any) {
    this.loading.set(false);
    if (!super.isOK(res)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: super.getErrorMsg(res),
      });
      return;
    } else if (res.header.referance == 'LOAD_PRODUCTS_NAME') {
      this.productsName.update(() => res.payload);
    } else if (res.header.referance == 'SAVE') {
      this.isClick.update(() => false);

      console.log(res.payload);
      this.closeModal();
      Swal.fire({
        title: 'সফল হয়েছে!',
        text: 'অপরাধের তথ্য সেভ করা হয়েছে।',
        icon: 'success',
      }).then(() => {
        if (this.configGroup == 'PRODUCTS_NAME_GROUP') {
          this.productsName.update(() => res.payload);
        } else if (this.configGroup == 'PRODUCTS_UNIT_GROUP') {
          this.productsUnitName.update(() => res.payload);
        }
        this.value1 = null;
        this.configGroup = '';
        this.configSubGroup = '';
        this.h1 = '';
        this.inputField = '';
      });
    }
    // else if (res.header.referance == 'SAVE_ECONOMIC') {
    //   this.isClick.update(() => false);
    //   console.log(res.payload);
    //   Swal.fire({
    //     title: "সফল হয়েছে!",
    //     text: "তথ্য সেভ করা হয়েছে।",
    //     icon: "success"
    //   });
    //   return;
    // }
    else if (
      res.header.referance == 'SAVE_ECONOMIC' ||
      res.header.referance == 'UPDATE_ECONOMIC'
    ) {
      this.isClick.update(() => false);
      this.isConfirmed.update(() => false);
      console.log(res.payload);
      Swal.fire({
        title: 'সফল হয়েছে!',
        text: 'তথ্য সেভ করা হয়েছে।',
        icon: 'success',
      }).then(() => {
        // Refresh the grid after saving/updating
        this.loadFinancial();
      });
      return;
    } else if (res.header.referance == 'select') {
      this.financialList = res.payload.content || [];
      this.total = res.payload?.page.totalElements;
      this.totalPages = res.payload?.page.totalPages;

      this.buildUserDataset();
    } else if (res.header.referance == 'DELETE_ECONOMIC') {
      console.log(res.payload);

      Swal.fire({
        title: 'সফল হয়েছে!',
        text: 'তথ্য মুছে ফেলা হয়েছে।',
        icon: 'success',
      }).then(() => {
        this.loadFinancial();
      });
      return;
    }

    this.callPagination = false;
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
