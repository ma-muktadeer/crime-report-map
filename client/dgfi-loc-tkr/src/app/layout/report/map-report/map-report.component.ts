import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { MapService, MarkerData } from '../../service/map.service';
import { CommonSearchRepComponent } from "../common-search-rep/common-search-rep.component";
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-report',
  imports: [CommonSearchRepComponent, FormsModule],
  templateUrl: './map-report.component.html',
  styleUrl: './map-report.component.scss'
})
export class MapReportComponent extends Softcafe implements Service {
  @ViewChild('staticBackdrop') modalElement!: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  readonly _dateFormaterService = inject(DateFormatterService);
  mapService = inject(MapService);
  cs = inject(CommonService);
  title: string = '';
  comments: string = '';

  sampleData: MarkerData[] = [
    {
      coordinates: [90.3563, 23.6850],
      properties: {
        name: "Dhaka Center",
        description: "Capital of Bangladesh",
        number: "city"
      }
    },
    {
      coordinates: [90.3832, 23.8103],
      properties: {
        name: "Important Location",
        description: "Sample point of interest",
        number: "poi"
      }
    },
    {
      coordinates: [90.3832, 22.8103],
      properties: {
        name: "Important Location",
        description: "Sample point of interest",
        number: "nai"
      }
    },
  ];
  mapData = signal<any[]>(null);
  reportType: string = 'CRIME';
  mapDetailsData = signal<any[]>(null);
  private modalInstance!: Modal;

  ngOnInit() {
    // this.searchMap();
  }
  ngAfterViewInit() {
    // Initialize the Bootstrap modal properly
    this.modalInstance = new Modal(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }
  searchMap(value?: any) {
    const payload = value || {};

    this.cs.sendRequest(this, ActionType.SEARCH_MAP, ContentType.VwCrimeInfo, 'SEARCH', payload);
  }


  openModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  closeModal() {
    debugger
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  async buildMap(rawData: any) {
    console.log('map value', this.mapData());
    debugger
    const markerDataList: MarkerData[] = this.markerData(rawData);

    console.log('Initializing map with container ID: map');
    await this.mapService.initMap('map', [90.3563, 23.6850], 6, markerDataList);
    console.log('Map initialized successfully!');
  }

  markerData = (rawData: any[]): MarkerData[] =>
    rawData.map((item) => ({
      coordinates: {
        lng: item.lng,
        lat: item.lat,
      },
      properties: {
        name: item.distict,
        number: item.countNumber.toString(),
      },
    }));

  ngOnDestroy(): void {
    this.mapService.distroyMap();
  }

  isSameDay(dateString: string): boolean {
    if (!dateString) return false;

    const today = new Date();
    const compareDate = new Date(dateString);

    return today.getFullYear() === compareDate.getFullYear() &&
      today.getMonth() === compareDate.getMonth() &&
      today.getDate() === compareDate.getDate();
  }

  searchValue(value: any) {
    debugger
    console.log('getting value', value);
    if (value && value.type) {
      this.reportType = value.type.toUpperCase(); // Update reportType based on search input
    }
    this.searchMap(value);

  }
  async exportPDF() {
    debugger
    const type = this.mapDetailsData() ? this.mapDetailsData()[0]?.type || 'CRIME' : 'CRIME';
    let dt: any = {
      // if(type != 'CRIME') {
      type: type,
      detailsValue: this.mapDetailsData(),
      mapData: this.mapData(),
    }
    // }
    this.closeModal();
    this.mapService.downloadMapWithMarkersAsPDF('map', this.pdfTable, 'map.pdf', dt, this.title, this.comments).then((res: any) => {
      if (res == true) {
        console.log('PDF downloaded successfully!');
      }
      else {
        console.log('Error downloading PDF!');
        alert(`Error downloading PDF!\n ${res}`);
      }
      this.title = '';
      this.comments = '';
    });
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      console.log('Response received:', res);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: super.getErrorMsg(res),
        confirmButtonText: 'OK',
      });
      return;
    }
    else if (res.header.referance === 'SEARCH') {
      debugger
      if (res?.payload) {
        this.mapData.update(() => res.payload.mapCoreData);
        this.mapDetailsData.update(() => res.payload.mapDetailsData ?? null);
        console.log('mapDetailsData', this.mapDetailsData());

        this.buildMap(this.mapData());
      }
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
