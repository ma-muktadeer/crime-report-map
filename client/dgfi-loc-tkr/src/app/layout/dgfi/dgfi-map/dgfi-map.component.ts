import { Component, inject, signal } from '@angular/core';
import { SoftLoadingComponent } from "../../common/soft-loading/soft-loading.component";
import { MapService, MarkerData } from '../../service/map.service';

@Component({
  selector: 'app-dgfi-map',
  imports: [SoftLoadingComponent],
  templateUrl: './dgfi-map.component.html',
  styleUrl: './dgfi-map.component.scss'
})
export class DgfiMapComponent {

  isLoading = signal<any>(true);


  mapService = inject(MapService);


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
      coordinates: [89.70821644068445, 22.150889405351094],
      properties: {
        name: "Important Location",
        description: "Sample point of interest",
        number: "poi"
      }
    },

    // {
    //   coordinates: [90.368718,23.681153],lat
    //   properties: {
    //     name: "Important Location",
    //     description: "Sample point of interest",
    //     number: "poi"
    //   }
    // },
    {
      coordinates: [90.3832, 22.8103],
      properties: {
        name: "Important Location",
        description: "Sample point of interest",
        number: "nai"
      }
    },
  ];

 async ngOnInit() {
    this.isLoading.update(()=>true);

    console.log('Initializing map with container ID: map');
    await this.mapService.initMap('map', [90.3563, 23.6850], 6, this.sampleData);
    this.isLoading.update(()=>false);
    console.log('Map initialized successfully!');
  }

  ngOnDestroy(): void {
    this.mapService.removeMarkers();
  }

  getMarkers() {
    const markers = this.mapService.getMarkers();
    console.log('markers are =>', markers);
    return markers;
  }

 async exportPDF() {
    if(this.isLoading()) {
        console.log('Loading in progress, please wait...'); 
        return;
      }

    this.isLoading.update(()=>true);

    debugger
    this.mapService.downloadMapWithMarkersAsPDF('map').then((res: any) => {
      if(res == true) {
        console.log('PDF downloaded successfully!');
      }
      else {
        console.log('Error downloading PDF!');
        alert(`Error downloading PDF!\n ${res}`);
      }
      this.isLoading.set(false);
    });
    
  }
}
