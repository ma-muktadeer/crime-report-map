import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularGridInstance, Column, FieldType, Formatter, Formatters, GridOption, Pagination, PaginationService } from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import { Softcafe } from '../../softcafe/common/Softcafe';
import { ActionType } from '../../softcafe/constants/action-type.enum';
import { ContentType } from '../../softcafe/constants/content-type.enum';
import { CommonService } from '../../softcafe/service/common.service';
import { Service } from '../../softcafe/service/service';
import { SoftGridModule } from '../common/soft-grid/soft-grid.module';
import { SoftLoadingComponent } from "../common/soft-loading/soft-loading.component";
import { CustomGridData } from '../service/CustomGridData';
import { SoftAlertService } from '../service/soft-alert.service';


@Component({
  selector: 'app-transction',
  imports: [ FormsModule, CommonModule, ReactiveFormsModule, SoftLoadingComponent, SoftGridModule,],
  templateUrl: './transction.component.html',
  styleUrl: './transction.component.scss',
  standalone: true,
  
})


export class TransctionComponent extends Softcafe implements Service, AfterViewInit {

  progress = signal<number>(-1);
  searchForm: FormGroup;

  showGrid =  signal<boolean>(false);
  tnxList = signal<CustomGridData>(null);

  callPagination: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 20;
  actionColumnWidth = 10;
  totalPages: any;
  
  loading = signal<boolean>(false);
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  //dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;

  paginationService: PaginationService;
  isRequestInProgress = false;

  constructor(
    private cs: CommonService,
    private fb: FormBuilder,
    private alert: SoftAlertService
  ) {
    super();
    this.searchForm = this.fb.group({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      cbsTransactionId: new FormControl(''),
      cbsCreditAccount: new FormControl(''),
      cbsTxnStatus: new FormControl(''),
      fundSourceTxnId: new FormControl(''),
      fundTargetTxnId: new FormControl(''),
      transactionType: new FormControl(''),

    });
    this.prepareGrid();
  }


  ngOnInit(): void {
    this.loadTransctionList();
    this.buildGridOptions();
    
   // this.gridOptions = this.buildGridOptions();
  }

  ngAfterViewInit(): void {
    if (this.angularGrid) {
      this.gridObj = this.angularGrid.slickGrid;
    }
  }

  loadTransctionList(pagination?: Pagination) {
    debugger
    if (this.isRequestInProgress) {
      return;
  }
  this.isRequestInProgress = true;
  this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
  this.pageSize = pagination?.pageSize ?? this.pageSize;
  
    const formValues = this.searchForm.value;
    var payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize ?? 20,
      fromDate: formValues.fromDate,
      toDate: formValues.toDate,
      cbsTransactionId: formValues.cbsTransactionId, 
      cbsCreditAccount: formValues.cbsCreditAccount,
      cbsTxnStatus: formValues.cbsTxnStatus,
      fundSourceTxnId: formValues.fundSourceTxnId,
      fundTargetTxnId: formValues.fundTargetTxnId,
      transactionType: formValues.transactionType
  }
    this.loading.set(true);
    this.cs.sendRequestAdmin(this, ActionType.SELECT_ALL, ContentType.Transaction, "selectAll", payload);
  } 

  loadTransction(pagination?: Pagination) {
    debugger
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    var payload = this.searchForm.value;
    payload = {
      ...payload,
      pageNumber: this.pageNumber !=0 ? this.pageNumber : 1,
      pageSize: this.pageSize ??20,
     

      
    }
    this.loading.set(true);
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.Transaction, "select", payload);
  } 
  
  download(exportType: 'EXCEL' | 'CSV' | 'PDF') {
debugger
    const fileExportRequest = {
      ...this.searchForm.value,
      viewName: 'VW_TXN_EXPORT',
     // viewName: 'VW_TRANSACTION',
      fileExportType: exportType,
    };

    debugger
      this.cs.fileDownload('/export', fileExportRequest).subscribe(
        {
          next: (event: any) => {
            if (event?.state === 'progress') {
              this.progress.update(() => event?.progress);
            } else if (event?.state === 'completed') {
              this.saveFile(event?.file, event?.fileName ?? 'abc.pdf');
              this.progress.update(() => -1);
            }
          },
          error: (error: any) => {
            console.log('Error occurred:', error);
            this.alert.showAlert('Error', 'Failed to Download.', 'error');
            this.progress.update(() => -1);
          }
        });
        // next:(event: any)=>{
          
        //     if (event?.state == 'progress') {
        //       this.progress.update(()=> event?.progress);
        //     } else if (event?.state == 'completed') {
        //       this.saveFile(event?.file, event?.fileName ?? 'abc.pdf');
        //       this.progress.update(() => -1);
        //     }
          
        // },
        // (error) => {
        //   console.log('getting error', error);
        //   this.progress.update(() => -1);
  
        // }
      // )
    }
    saveFile(file: any, fileName: any) {
      saveAs(file, fileName);
    }


  reset() {
    this.searchForm.reset();
    this.pageNumber = 1;
    this.loadTransctionList();
  }

  // columnDefs = [
  //   { field: 'idTransactionKey', headerName: 'ID', sortable: true, filter: true },
  //   { field: 'name', headerName: 'Name', sortable: true, filter: true }
  // ];

  // defaultColDef = { flex: 1, resizable: true };

  // rowData = []; // No static row data

  // datasource = {
  //   getRows: (params: any) => {
  //     console.log('Requesting rows', params);
  //     const rows = Array.from({ length: 1000 }, (_, i) => ({
  //       id: i,
  //       name: `Name ${i}`
  //     }));

      
  //     // Simulate server-side pagination
  //     const startRow = params.startRow;
  //     const endRow = params.endRow;
  //     const rowsThisPage = rows.slice(startRow, endRow);

  //     params.successCallback(rowsThisPage, rows.length);
  //   }
  // };

  // entryDateFormatter : Formatter = (params: any, a, v, c) => {
  //   console.log(params, a, v, c);
  //   return null;
  // }


  serialFormmater : Formatter = (index, a, v, c) => {
    console.log(index, a, v, c);
    return index + 1 + '';
  }


  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'serialKey', name: 'Sl.', field: 'serialKey',
        minWidth: 40, 
        excludeFromColumnPicker: true,
        excludeFromExport: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        resizable: true,
        focusable: false,
        selectable: false,
        formatter: this.serialFormmater,
      },
      {
        id: 'txCbsTxnStatus', name: 'CBS Txn Status', field: 'txCbsTxnStatus', sortable: true, type: FieldType.text,minWidth: 150,
      },
      {
        id: 'decAmount', name: 'DEC Amount', field: 'decAmount', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'dttEntry', name: 'Entry Date', field: 'dttEntry', sortable: true, type: FieldType.date, minWidth: 180, formatter : Formatters['dateTimeIsoAM_PM'], 
      },
      {
        id: 'txCbsTxnId', name: 'CBS Txn ID', field: 'txCbsTxnId', sortable: true, type: FieldType.text,minWidth: 150,
      },
      {
        id: 'txCbsCdtAcc', name: 'CBS Credit Account', field: 'txCbsCdtAcc', sortable: true, type: FieldType.text,minWidth: 150,
      },
      {
        id: 'txFundSrcTxnId', name: 'Fund Source Txn ID', field: 'txFundSrcTxnId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txnFundTargetTxnId', name: 'Fund Target Txn ID', field: 'txnFundTargetTxnId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'dttCbsTxn', name: 'DTT CBS TXN', field: 'dttCbsTxn', sortable: true, type: FieldType.date, minWidth: 180,  formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'dttFundSrcTxn', name: 'Fund Source  DTxnate', field: 'dttFundSrcTxn', sortable: true, type: FieldType.date, minWidth: 180,  formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'dttFundTargetTxn', name: 'Fund Target Txn Date', field: 'dttFundTargetTxn', sortable: true, type: FieldType.date, minWidth: 180,  formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'txTxnType', name: 'Txn Type', field: 'txTxnType', sortable: true, type: FieldType.text, minWidth: 250,
      },
     
      {
        id: 'dttMod', name: 'Modification Date', field: 'dttMod', sortable: true, type: FieldType.date, minWidth: 180, formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'dttP2p', name: 'P2P Txn Date', field: 'dttP2p', sortable: true, type: FieldType.date, minWidth: 180, formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'dttReverse', name: 'Reversal Date', field: 'dttReverse', sortable: true, type: FieldType.date, minWidth: 180, formatter : Formatters['dateTimeIsoAM_PM'],
      },
      {
        id: 'idTransactionKey', name: 'Txn Key', field: 'idTransactionKey', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCbsChannel', name: 'CBS Channel', field: 'txCbsChannel', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCbsDbtAcc', name: 'CBS Debit Account', field: 'txCbsDbtAcc', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCbsRvTxnId', name: 'CBS Reversal Txn ID', field: 'txCbsRvTxnId', sortable: true, type: FieldType.text, minWidth: 150,
      },
     
      {
        id: 'txCdrAppvlCd', name: 'Approval Code', field: 'txCdrAppvlCd', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCommentCrdDbt', name: 'Credit/Debit Comment', field: 'txCommentCrdDbt', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCommentP2p', name: 'P2P Comment', field: 'txCommentP2p', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txCurrency', name: 'Currency', field: 'txCurrency', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txDesc', name: 'Description', field: 'txDesc', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txErrorCode', name: 'Error Code', field: 'txErrorCode', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txErrorMsg', name: 'Error Message', field: 'txErrorMsg', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txExtResCode', name: 'External Response Code', field: 'txExtResCode', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txFndSrcRvTxnId', name: 'Fund Source Reversal Txn ID', field: 'txFndSrcRvTxnId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txFndSrcRvrsTxnSt', name: 'Fund Source Reversal Txn Status', field: 'txFndSrcRvrsTxnSt', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txFndSrcTxnSt', name: 'Fund Source Txn Status', field: 'txFndSrcTxnSt', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txFndTrgtTxnStatus', name: 'Fund Target Txn Status', field: 'txFndTrgtTxnStatus', sortable: true, type: FieldType.text, minWidth: 150,
      },
     
      {
        id: 'txInvoiceNo', name: 'Invoice Number', field: 'txInvoiceNo', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txName', name: 'Name', field: 'txName', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pAuthResCd', name: 'P2P Auth Response Code', field: 'txP2pAuthResCd', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pErr', name: 'P2P Error', field: 'txP2pErr', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pErrCode', name: 'P2P Error Code', field: 'txP2pErrCode', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pExtResCd', name: 'P2P External Response Code', field: 'txP2pExtResCd', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pExtRrn', name: 'P2P External RRN', field: 'txP2pExtRrn', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pExtStan', name: 'P2P External STAN', field: 'txP2pExtStan', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txP2pTxnId', name: 'P2P Txn ID', field: 'txP2pTxnId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txRDescription', name: 'Reversal Description', field: 'txRDescription', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txRequestId', name: 'Request ID', field: 'txRequestId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txResponeMsg', name: 'Response Message', field: 'txResponeMsg', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txResponseCode', name: 'Response Code', field: 'txResponseCode', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txSessionId', name: 'Session ID', field: 'txSessionId', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txSourceFndNumber', name: 'Source Fund Number', field: 'txSourceFndNumber', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTargetBankCode', name: 'Target Bank Code', field: 'txTargetBankCode', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTargetFndNumber', name: 'Target Fund Number', field: 'txTargetFndNumber', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTransactionStatus', name: 'Txn Status', field: 'txTransactionStatus', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTxnNarration', name: 'Txn Narration', field: 'txTxnNarration', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTxnReferance', name: 'Txn Reference', field: 'txTxnReferance', sortable: true, type: FieldType.text, minWidth: 150,
      },
      {
        id: 'txTxnRvrsdNarration', name: 'Reversed Narration', field: 'txTxnRvrsdNarration', sortable: true, type: FieldType.text, minWidth: 150,
      },
     
      {
        id: 'txWalletProvider', name: 'Wallet Provider', field: 'txWalletProvider', sortable: true, type: FieldType.text, minWidth: 150,
      },
    
      

    ];


  }

  buildGridOptions() {
  
    let option: GridOption = {
      datasetIdPropertyName: 'transactionId',
      enableAutoResize: true,
      gridWidth: '100%',
      autoResize: {
        container: '#demo-container1',
        rightPadding: 10
      },
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true
      },
      enableCellNavigation: true,
      enableFiltering: false,
      showHeaderRow: false,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enablePagination: true,
      pagination: {

        pageSizes: [5, 10, 20, 50, 80, 150],
        pageSize: this.pageSize,
        totalItems: 0,
      },
      enableCellMenu: true,
      enableContextMenu: true,
      contextMenu: {},
      presets: {},
      enableHeaderMenu: true,
      headerMenu: {
        hideFreezeColumnsCommand: false
      },
      columnPicker: {
        onColumnsChanged: (e, args) => {
          console.log(args);
        }
      },
      gridMenu: {
        hideClearFrozenColumnsCommand: false,
        hideExportCsvCommand: false
      }
    }
    return option;

  }
  paginationChanged($event: any) {
    // if(this.callPagination){
    //   return;
    // }
    // this.callPagination = true;
    this.pageNumber = $event.pageNumber;
    this.pageSize = $event.pageSize;
    this.loadTransction($event as Pagination);
  }
  // buildGridData() {
  //   let dt: CustomGridData = {
  //     content: this.tnxList()?.content,
  //     total: this.tnxList()?.total,
  //     totalPages: this.tnxList()?.totalPages,
  //     pageSize: this.pageSize
  //   }
  //   this.tnxList.set(dt);
  // }

  onResponse(service: Service, req: any, res: any) {
    debugger
    this.isRequestInProgress = false;
    this.loading.set(false);

    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));
      return;
    }

    // if (res.header.referance === 'select') {
    //   this.showGrid.set(true);
    //   console.log('Response payload:', res.payload);
    //   this.tnxList.set({
    //     content: res.payload.content,
    //     total: res.payload.totalElements,
    //     totalPages: res.payload.totalPages,
    //     pageSize: this.pageSize
    //   });
    //   }
    //   if (res.header.referance === 'selectAll') {
    //     this.showGrid.set(true);
    //     console.log('Response payload:', res.payload);
    //     this.tnxList.set({
    //       content: res.payload.content,
    //       total: res.payload.totalElements,
    //       totalPages: res.payload.totalPages,
    //       pageSize: this.pageSize
    //     });
    //     }

    
    if (res.header.referance === 'select' || res.header.referance === 'selectAll') {
      this.showGrid.set(true);
      const gridData: CustomGridData = {
          content: res.payload.content,
          total: res.payload.page.totalElements,
          totalPages: res.payload.page.totalPages,
          pageSize: this.pageSize
      };
     this.tnxList.set(gridData);
  //  this.buildGridData();
  }



      // Set the response payload directly since it matches CustomGridData type
      // let dt: CustomGridData = {
      //   content: res.payload.content,
      //   total: res.payload.totalElements,
      // }
      // this.tnxList.set(dt);
      // }
  }


  // reset(): void {
  //   this.fromDate = null;
  //   this.toDate = null;

  //   this.tnxList.set(null);
  //   this.total = 0;
  //   this.dataset = [];

  //   console.log('Filters reset. Reloading transaction list...');
  //   this.loadTransctionList();
  // }



  onError(service: Service, req: any, res: any) {
    this.isRequestInProgress = false;
    this.loading.set(false);
    console.error('Error Details:', {
      service: service,
      request: req,
      response: res,
      stack: res?.error?.stack,
      message: res?.error?.message || res?.message
    });
  }

}
