import { ChangeDetectionStrategy, Component, effect, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Signal, signal, SimpleChanges } from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, ContextMenu, GridOption, Pagination, PaginationService } from 'angular-slickgrid';
import { CustomGridData } from '../../service/CustomGridData';

@Component({
  selector: 'app-custom-grid',
  standalone: true,
  imports: [AngularSlickgridModule],
  templateUrl: './custom-grid.component.html',
  styleUrl: './custom-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomGridComponent implements OnInit, OnDestroy, OnChanges {

  gridId: string;

  @Output() onPaginationChanged: EventEmitter<any> = new EventEmitter<any>();

  // showGrid = true;
  public paginationService: PaginationService;

  // columnDefinitions can not be null. it must be send
  @Input() columnDefinitions!: Column[];
  // datasetObs can not be null. it must be send. it is a CustomGridData object.
  @Input() datasetObs!: Signal<CustomGridData>;
  // @Input() datasetObs!: Observable<CustomGridData>;
  // pageNumber?: number = 1;
  @Input() pageSize?: number = 20;
  // datasetIdPropertyName can not be null. it must be send. it is a grid unic id. 
  @Input() datasetIdPropertyName?: string = 'gridId';
  // if you need to context menu then enableContextMenu = true
  @Input() enableContextMenu?: boolean = false;
  // if enableContextMenu = true then need to pass contextMenu. default is {}
  @Input() contextMenu?: ContextMenu = {};
  //default pagination is true. if you not need then enablePagination = false
  @Input() enablePagination?: boolean = true;
  //default multiSelect is true. if you not need then enablePagination = false
  @Input() multiSelect?: boolean = true;
  //default checkboxSelector is true. if you not need then enablePagination = false
  @Input() checkboxSelector?: boolean = true;
  //it is a custom pagination 
  @Input() customPagination?: Pagination;

  total!: number;
  // @Input()
  gridOptions?: GridOption;
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj: import("angular-slickgrid").SlickDataView<any>;
  height: number;
  width: number;
  dataset = signal<any[]>([]);
  // private datasetDiffer: KeyValueDiffer<string, any> | null = null;
  showGrid = false;
  constructor(
    // private cdf: ChangeDetectorRef,
  ) {
    this.gridId= this.uuidv4()
    effect(() => {
      console.log('getting log commmn,', this.datasetObs());
      if (this.datasetObs()?.content) {
        this.subscribeToDatasetObs();
      }
    })
  }

  uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }


  ngOnInit(): void {
    this.gridOptions = this.buildGridOption();
    // this.subscribeToDatasetObs();
    this.getWindowSize();
    if (this.gridOptions) {
      // this.gridOptions.datasetIdPropertyName = this.datasetIdPropertyName;
      this.gridOptions.enableContextMenu = this.enableContextMenu;
      this.gridOptions.contextMenu = this.contextMenu;
      this.gridOptions.enablePagination = this.enablePagination;
      if (this.customPagination) {
        this.gridOptions.pagination = this.customPagination;
      }
    }
    this.showGrid = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger
    // if (changes['datasetObs']) {
    //   if (changes['datasetObs'].currentValue && !changes['datasetObs'].firstChange) {
    //     this.subscribeToDatasetObs();
    //   }
    // }
    if (this.datasetObs()) {
      this.subscribeToDatasetObs();
    }
  }


  ngOnDestroy(): void {
    this.paginationService ? this.paginationService.dispose() : '';
  }

  private subscribeToDatasetObs(): void {
    this.showGrid = true;
    debugger
    if (this.datasetObs()) {
      const dt = this.datasetObs()
      this.dataset.set(dt?.content ?? []);
      this.total = dt?.total ?? 0;
      // this.datasetObs.subscribe(data => {
      //   // this.dataset = data;
      //   this.dataset.set(data.content.map(item => ({ ...item })));
      //   this.total = data.total;
      //   console.log('Dataset updated:', this.dataset());
      //   this.handleDatasetChange()
      // });

      this.handleDatasetChange();
    }
  }
  private handleDatasetChange(): void {
    // Add additional logic to handle the change if needed
    setTimeout(() => {
      if (this.paginationService) {

        // Simulate user going to previous page (workaround)
        this.dataViewObj.setPagingOptions({ pageSize: this.paginationService.itemsPerPage, pageNum: this.paginationService.pageNumber });
        this.paginationService.refreshPagination(false, false);
        // Update total items
        this.paginationService.updateTotalItems(this.total ?? this.dataset().length);

        // If necessary, trigger pagination change explicitly:
        // This ensures proper grid updates based on the new total
        this.paginationService.refreshPagination();
      }
    }, 100);
    // this.cdf.detectChanges();
  }

  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.gridObj = this.angularGrid.slickGrid;

    this.dataViewObj = this.angularGrid.dataView;

    // it also exposes all the Services
    this.paginationService = this.angularGrid.paginationService;

    this.angularGrid.eventPubSubService.subscribe('onGridStateChanged', (data) => {
      // this.handleGridStateChanged(data);
    });

  }

  buildGridOption(): GridOption {

    let option: GridOption = {
      datasetIdPropertyName: this.datasetIdPropertyName,
      enableAutoResize: true,
      gridWidth: '100%',
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: this.checkboxSelector,
      enableRowSelection: this.checkboxSelector,
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
        applySelectOnAllPages: true, 
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: !this.multiSelect && this.checkboxSelector,
      },

      /////
      enablePagination: this.enablePagination,
      pagination: this.enablePagination ? this.customPagination ?? {
        // pageNumber: this.pageNumber,
        pageSizes: [1, 10, 20, 50, 80, 150],
        pageSize: this.pageSize,
        totalItems: 0,
      } : { pageSize: 20, pageSizes: [1, 10, 20, 50, 80, 150] },
      enableCellMenu: true,
      enableContextMenu: this.enableContextMenu,
      contextMenu: this.contextMenu ?? {},
      // contextMenu: {
      //   hideCloseButton: false,
      //   hideCopyCellValueCommand: true,
      //   commandItems: [
      //     {
      //       command: 'Active_Status',
      //       iconCssClass: 'fa fa-user',
      //       title: 'Active/Inactive user',
      //       positionOrder: menuOrder++,
      //       action: (e, args) => { this.toggleActivation(e, args) },
      //       disabled: false,
      //       itemUsabilityOverride: (args) => {
      //         debugger
      //         console.log(args);
      //         args.grid.getOptions().contextMenu.commandItems.forEach(element => {
      //           if (element['command'] == 'Active_Status') {
      //             element['title'] = this.checkStatus(args.dataContext.userStatus, args.dataContext.allowLogin);
      //           }
      //         });
      //         return this.checkActiveRole(args.dataContext);
      //         // return true;
      //       },
      //       itemVisibilityOverride: (args) => {

      //         return this.checkUserActionVisibility(args.dataContext);
      //         // return true;
      //       }
      //     },
      //     {
      //       command: 'Password_Admin',
      //       iconCssClass: 'fa fa-key',
      //       title: 'Change Password',
      //       positionOrder: menuOrder++,
      //       action: (e, args) => { this.changeUserPassword(e, args) },
      //       disabled: false,
      //       itemVisibilityOverride: (args) => this.checkPasswordAdminVisibility(args.dataContext),
      //     },
      //     {
      //       command: 'Manage_Role',
      //       iconCssClass: 'fa fa-cogs',
      //       title: 'Manage Role',
      //       positionOrder: menuOrder++,
      //       action: (e, args) => { this.manageUserRole(args.dataContext) },
      //       disabled: false
      //     },
      //   ]
      // },
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


  handleGridStateChanged(change: any) {
    console.log(change);
    debugger
    // if (change.change.type == GridStateType.filter) {
    // } else if (change.change.type == GridStateType.pagination) {
    //   this.onPaginationChanged.emit(change.gridState.pagination);

    // }
    // else if (change.change.type == GridStateType.rowSelection) {
    //   this.handleRowSelection(change);
    // }

    this.onPaginationChanged.emit(change.detail);

  }


  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.7;
    this.width = document.getElementById('id')?.offsetWidth;
    debugger
    let grid = document.getElementById('userGridId');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid?.slickGrid?.resizeCanvas();
    }
  }
}
