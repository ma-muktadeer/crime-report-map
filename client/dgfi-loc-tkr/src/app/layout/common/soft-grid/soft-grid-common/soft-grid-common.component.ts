import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { AngularGridInstance, AngularSlickgridComponent, AngularSlickgridModule, BackendService, BackendServiceOption, Column, ContextMenu, FilterChangedArgs, GridOption, OperatorType, Pagination, SlickDataView } from 'angular-slickgrid';
import { SoftGridPaginationComponent } from '../soft-grid-pagination/soft-grid-pagination.component';

let timer: any;
const DEFAULT_FILTER_TYPING_DEBOUNCE = 10;

@Component({
  selector: 'app-soft-grid-common',
  imports: [AngularSlickgridModule],
  templateUrl: './soft-grid-common.component.html',
  styleUrl: './soft-grid-common.component.scss'
})
export class SoftGridCommonComponent implements OnInit, AfterViewInit, BackendService {

  // if enableContextMenu = true then need to pass contextMenu. default is {}
  @Input() contextMenu?: ContextMenu = {};
  @Input() gridDataValue: any[] = [];

  @Input() gridHeight = 100;
  @Input() gridWidth = 600;

  gridHeightString!: string;
  gridWidthString!: string;

  @ViewChild('angularSlickGrid', { static: true }) angularSlickGrid!: AngularSlickgridComponent;

  columnDefinitions: Column[] = [];
  dataset = signal<any>(null);
  gridObj: any;
  dataviewObj: any;
  isAutoEdit = false;
  updatedObject: any;
  isMultiSelect = true;
  selectedObjects!: any[];
  selectedObject: any;

  // Slick grid
  metaData: any;
  columnData: any;
  rowsData: any;
  selects: any;
  id: any;

  options!: BackendServiceOption;
  pagination?: Pagination;

  @Output() onFilterChanged: EventEmitter<FilterChangedArgs> = new EventEmitter<FilterChangedArgs>();
  @Output() onPaginationChanged: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @Output() onSortChanged: EventEmitter<any> = new EventEmitter<any>();

  sortedGridColumn = '';
  currentPage = 1;
  filteredGridColumns = '';

  // Data

  // Injected functions
  private _onRowDoubleClick: Function = new Function();
  private _onRowClick: Function = new Function();

  private _selectedRow: any;

  private filterBy: Map<any, any> = new Map<any, any>();
  private sortBy: Map<string, boolean> = new Map<string, boolean>();
  customId= signal<string>(this.createUUID());

  gridOptions: GridOption = {
    asyncEditorLoading: true,
    autoEdit: this.isAutoEdit,
    autoResize: {
      container: '#common-grid-container',
      rightPadding: 10
    },
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
    enableCheckboxSelector: true,
    enableFiltering: true,
    rowHeight: 35,
    forceFitColumns: true,
    enableAutoTooltip: true,
    enableGridMenu: true,
    enablePagination: false,
    enableContextMenu: true,

    enableAutoResize: false,
    enableSorting: true,
    createPreHeaderPanel: false,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 28,
    explicitInitialization: true,
    gridMenu: {
      iconButtonContainer: 'preheader',
      hideClearFrozenColumnsCommand: false,
      hideExportCsvCommand: false
    },
    enableExcelExport: true,
    excelExportOptions: {
      exportWithFormatter: true
    },
    externalResources: [new ExcelExportService()],

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

    checkboxSelector: {
      // you can toggle these 2 properties to show the "select all" checkbox in different location
      hideInFilterHeaderRow: false,
      hideInColumnTitleRow: true
    },
    enableCellMenu: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
    },

  };


  // Initialized to a fake pagination object
  private _paginationComponent: any = {
    processing: false,
    realPagination: false
  };

  @Input()
  set paginationComponent(value: SoftGridPaginationComponent) {
    if (value.realPagination) {
      this._paginationComponent = value;
      this.gridOptions.backendServiceApi = {
        service: this,
        preProcess: () => { },
        process: () => {
          return null;
        },
        postProcess: () => { },
        options: {
          enableCount: false,
          enableSelect: true,
          enableExpand: true,
          filterQueryOverride: ({ fieldName, columnDef, columnFilterOperator, searchValues }) => {
            if (columnFilterOperator === OperatorType.custom && columnDef?.id === 'name') {
              let matchesSearch = searchValues[0].replace(/\*/g, '.*');
              matchesSearch = matchesSearch.slice(0, 1) + matchesSearch.slice(1);
              matchesSearch = matchesSearch.slice(0, -1) + '$\'';

              return `matchesPattern(${fieldName}, ${matchesSearch})`;
            }
            return '';
          },
        },
      } as any;
      this._paginationComponent.gridPaginationOptions = this.gridOptions;

      this.angularSlickGrid.createBackendApiInternalPostProcessCallback(this.gridOptions);
    }
  }

  get paginationComponent(): SoftGridPaginationComponent {
    return this._paginationComponent;
  }
  /**
   *
   * @param gridService
   * @param resizer
   * @param httpClient
   */
  constructor() {

  }


  ngOnInit() {
    // this.gridHeightString = `${this.gridHeight}px`;
    // this.gridWidthString = `${this.gridWidth}px`;
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions.contextMenu = this.contextMenu;
  }

  /**
   *
   */
  ngAfterViewInit() {
    this.getWindowSize();
  }

  /**
  * CustomGrid constructor
  * @param columnData
  */

  createUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

  CustomGrid(columnData: any) {

    this.id = 'grid' + Math.floor(Math.random() * Math.floor(100));

    // get metadata from input JSON
    this.metaData = columnData;

    // COLUMNS DATA
    const rowData: any = [];

    // check if allcolumns tag contains any children
    if (this.metaData.columns.column) {

      // set columnsData and columnDefinitions
      this.columnData = this.metaData.columns.column;

      for (const colData of this.columnData) {
        const col = colData;
        this.columnDefinitions.push(col);
        rowData[col.id] = '';
      }

      // Columns are not visible, seems to be a bug ? next line fixed it..
      this.gridObj.setColumns(this.columnDefinitions);
      // this.columnDefinitions = columnData;
      this.angularSlickGrid.showPagination = false;

      // Show filters when grid starts; this could be parametrized
      // this.gridObj.setHeaderRowVisibility(false);
      // this.gridObj.setTopPanelVisibility(false);
    }

    // Dummy dataset
    this.dataset.update(() => rowData);

  }

  /**
   * CommonGrid constructor
   * @param _columnsData
   * @param _lockedColumnCount
   * @param _uniqueColumn
   * @param _baseURL
   * @param _programId
   * @param _componentId
   * @param _enableRenders
   * @param _colValidationMap
   * @param _checkHeader
   * @param _cboLinked
   */
  CommonGrid(_columnsData: any, _lockedColumnCount: number, _uniqueColumn: string, _baseURL: string, _programId: string, _componentId: string, _enableRenders = true, _colValidationMap = null, _checkHeader = false, _cboLinked = false) {
  }


  set gridData(rawData: any) {
    const dataProvider: any = [];

    for (let index = 0; rawData.row && index < rawData.row.length; index++) {
      const row = rawData.row[index] as object;
      const idObj = {
        id: index
      };

      let key: string;
      const rowData: any = [];
      for (key in row) {
        if (key in row) {
          rowData[key] = (row as any)[key];
        }
      }
      dataProvider[index] = Object.assign(rowData, idObj);
    }

    this.dataset.update(() => dataProvider);
    // this.dataset = dataProvider;
    this.paginationComponent.processing.update(() => false);

    // this.gridObj.setSortColumn('excludeType', true);
    // this.dataviewObj.reSort();
    // this.gridObj.setSortColumns([{'columnId':'excludeType','sortAsc':true}]);

    // this.gridObj.invalidate();
    // this.gridObj.render();
  }

  get gridData(): any {
    return this.dataset();
  }

  gridReady(instance: any) {
    this.gridObj = instance.detail.slickGrid as AngularGridInstance;
    this.dataviewObj = instance.dataView;
  }

  dataviewReady(dataview: SlickDataView) {
    this.dataviewObj = dataview;
  }




  /********************************************************/
  /******** Pagination+Sot+Filter service : START *********/
  /********************************************************/
  buildQuery(): string {
    return 'buildQuery...';
  }

  init(serviceOptions: BackendServiceOption, pagination?: Pagination): void {
    this.options = serviceOptions;
    this.pagination = pagination;
  }


  resetPaginationOptions() {

  }

  updateOptions(serviceOptions?: Partial<BackendServiceOption>) {
    this.options = { ...this.options, ...serviceOptions };
  }


  /**
   * FILTERING EMIT EVENT
   * @param event
   * @param args
   */
  processOnFilterChanged(event: Event | undefined, args: FilterChangedArgs): string {
    debugger
    this.filteredGridColumns = '';
    let timing = 0;
    if (event && (event.type === 'keyup' || event.type === 'keydown')) {
      timing = DEFAULT_FILTER_TYPING_DEBOUNCE;
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.filteredGridColumns = '';
      for (const column of this.columnDefinitions) {
        // if(!column?.filterable) return;
        if (column.field in args.columnFilters) {
          // this.filteredGridColumns += args.columnFilters[column.field].searchTerms[0] + '|';
          this.filterBy.set(column.field, args.columnFilters[column.field].searchTerms[0]);
        }else if(this.filterBy.get(column.field)){
          this.filterBy.delete(column.field);

        }

        //  else {
        //   this.filteredGridColumns += 'All|';
        // }
      }
      if(this.filterBy.size){
        this.filterGridDate();
      }else{
        this.gridData = {row:this.gridDataValue};
      }

      // Reset to the first page
      // this.paginationComponent.pageNumber = 1;
      // this.currentPage = 1;

      // dispatch event
      // this.onFilterChanged.emit(args);
    }, timing);

    return '';
  }

  filterGridDate(){
    const fitterValueBy = this.convertMapToFilterCriteria();
    this.filterItems(this.gridDataValue, fitterValueBy);
  }

  convertMapToFilterCriteria(): FilterCriteria[] {
    const criteriaArray: FilterCriteria[] = [];
    this.filterBy.forEach((value, key) => {
      criteriaArray.push({ id: key, value: value });
    });
    return criteriaArray;
  }

  filterItems(
    items: any[],
    criteria: FilterCriteria[]
  ){
    const filteredItems = items.filter(item => {
      return criteria.every(criterion => {
        const itemValue = item[criterion.id];
        if (!criterion.value) {
          return true;
        }
        if (itemValue == null) {
          return false;
        }

        // Convert both itemValue and criterion value to strings for comparison
        const itemValueStr = itemValue.toString().toUpperCase();
        const cr = criterion.value as string;
        const criterionValueStr = cr.toUpperCase();

        return itemValueStr.includes(criterionValueStr);
      });
    });

    // this.dataset.update(() => filteredItems);
    this.gridData = {row:filteredItems};

    // const result = {
    //   payload: {
    //     content: filteredItems,
    //     total: filteredItems.length,
    //   }
    // };

    // return of(result);
  }


  /**
   * PAGINATION EMIT EVENT
   * @param _event
   * @param args
   */
  processOnPaginationChanged(_event: Event | undefined, args: Pagination) {
    this.currentPage = args.pageNumber;
    this.onPaginationChanged.emit(args);
    return 'onPaginationChanged';
  }

  /**
   * SORT EMIT EVENT
   * @param _event
   * @param args
   */
  processOnSortChanged(_event: Event | undefined, args: any) {
    this.sortedGridColumn = '';
    const sortDirection = '|' + args!.sortCols![0].sortAsc + '|';
    for (let idx = 0; idx < this.columnDefinitions.length; idx++) {
      if (this.columnDefinitions[idx].field === args!.sortCols![0].sortCol.field) {
        this.sortedGridColumn = '' + idx + sortDirection;
      }
    }
    this.onSortChanged.emit(args);
    return 'onSortChanged';
  }


  getFilteredGridColumns() {
    return this.filteredGridColumns;
  }

  getSortedGridColumn() {
    return this.sortedGridColumn;
  }

  /******** Pagination+Sot+Filter service: END *****************/

  // Getters and Setters
  // get selectedRow() {
  //   return this._selectedRow;
  // }
  // set selectedRow(row: any) {
  //   this._selectedRow = row;
  // }

  // get onRowDoubleClick() {
  //   return this._onRowDoubleClick;
  // }
  // set onRowDoubleClick(event: Function) {
  //   this._onRowDoubleClick = event;
  // }

  // get onRowClick() {
  //   return this._onRowClick;
  // }
  // set onRowClick(event: Function) {
  //   this._onRowClick = event;
  // }

  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    // this.height = window.innerHeight * 0.7;
    const width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById('gridId');
    if (grid) {
      grid.style.width = width + 'px';
      this.gridObj?.slickGrid?.resizeCanvas();
    }
  }

}



export interface GridFillter {
  columnId: any;
  searchTerm: any;
}

export interface Item {
  [key: string]: any;
}

export interface FilterCriteria {
  id: string;
  value: string | boolean;
}
