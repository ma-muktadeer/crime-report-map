import { ElementRef, inject, Injectable } from '@angular/core';
import centroid from '@turf/centroid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as maplibregl from 'maplibre-gl';
import { DateFormatterService } from 'src/app/softcafe/service/date-formatter.service';
import addKalpurushFont from 'src/assets/fonts/kalpurush-normal.js';
import { environment } from 'src/environments/environment';
// (pdfMake as any).vfs = customFonts;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly _dateFormaterService = inject(DateFormatterService);
  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  bdBounds = new maplibregl.LngLatBounds(
    [88.01, 20.52], // Southwest coordinates (min longitude, min latitude)
    [92.68, 26.63] // Northeast coordinates (max longitude, max latitude)
  );

  async distroyMap() {
    if (this.map) {
      this.removeMarkers();
      this.map.remove();
      this.map = null;
    }
  }

  async initMap(
    containerId: string,
    center: [number, number],
    zoom: number,
    initialMarkers?: MarkerData[]
  ): Promise<boolean> {
    await this.distroyMap();
    const container = document.getElementById(containerId);

    if (!container) {
      console.error('Map container not found');
      return true;
    }

    const { divisions, districts, districtLables } =
      await this.loadMapSources();

    this.map = new maplibregl.Map({
      container: containerId, // ID of the map container in the HTML
      style: {
        version: 8,
        glyphs: '/assets/fonts/{fontstack}/{range}.pbf', // Corrected path for local fonts
        sources: {
          'vector-tiles': {
            type: 'vector',
            tiles: [`${environment.TILES_URL}/{z}/{x}/{y}.pbf`],
            // minzoom: 5,
            // maxzoom: 14
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': 'hsla(0, 0.00%, 100.00%, 0.00)',
            },
          },

          {
            id: 'water-layer',
            type: 'fill',
            source: 'vector-tiles',
            'source-layer': 'water',
            paint: {
              'fill-color': [
                'match',
                ['get', 'class'],
                'river',
                '#4FC3F7', // Light Blue
                'lake',
                '#29B6F6', // Blue
                'pond',
                '#0288D1', // Deep Blue
                'reservoir',
                '#03A9F4', // Sky Blue
                '#FFFFFF', // Default
              ],
              'fill-opacity': 0.5,
            },
          },
          // COUNTRY BORDER (thickest, highest level)
          {
            id: 'bangladesh-border',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'boundary',
            filter: ['==', ['get', 'admin_level'], 2],
            minzoom: 0,
            paint: {
              'line-color': '#FF0000',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                8,
                2,
                12,
                4,
              ],
              'line-opacity': 1,
              // 'line-gap-width': 2, // Creates a small gap for glow effect
              'line-blur': 0.5, // Softens edges
              'line-dasharray': [2, 2],
            },
          },

          // DIVISION/PROVINCE BORDERS
          {
            id: 'division-border',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'boundary',
            filter: ['==', ['get', 'admin_level'], 4], // OSM admin_level=4 for divisions/states
            minzoom: 0, // Appears at zoom 4+
            maxzoom: 10,
            paint: {
              'line-color': '#FF0000',
              'line-width': 1,
              'line-dasharray': [2, 2],
              'line-opacity': 0.8,
            },
          },

          // // DISTRICT BORDERS
          {
            id: 'district-border',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'boundary',
            filter: ['match', ['get', 'admin_level'], [5, 6], true, false], // OSM admin_level=6 for districts
            minzoom: 5, // Appears at zoom 6+
            paint: {
              'line-color': '#0077FF',
              'line-width': 1.5,
              'line-dasharray': [1, 1],
            },
          },

          // UPAZILA/THANA BORDERS
          {
            id: 'upazila-border',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'boundary',
            filter: ['==', ['get', 'admin_level'], 8], // OSM admin_level=8 for upazilas
            minzoom: 8, // Appears at zoom 8+
            paint: {
              'line-color': '#00AA00',
              'line-width': 1,
              'line-opacity': 0.7,
            },
          },
          // UNION BORDERS
          {
            id: 'union-border',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'boundary',
            filter: ['==', ['get', 'admin_level'], 10], // OSM admin_level=10 for unions
            minzoom: 9, // Appears at zoom 9+
            paint: {
              'line-color': '#FFAA00',
              'line-width': 0.5,
              'line-opacity': 0.5,
            },
          },
          {
            id: 'land-layer',
            type: 'fill',
            source: 'vector-tiles',
            'source-layer': 'land',
            paint: {
              'fill-color': '#A0A0A0',
              'fill-opacity': 0.5,
            },
          },
          {
            id: 'building-layer',
            type: 'fill',
            source: 'vector-tiles',
            'source-layer': 'building',
            paint: {
              'fill-color': '#808080',
              'fill-opacity': 0.7,
            },
          },
          {
            id: 'landuse-layer',
            type: 'fill',
            minzoom: 10,
            source: 'vector-tiles',
            'source-layer': 'landuse',
            paint: {
              'fill-color': '#FFA500',
              'fill-opacity': 0.6,
            },
          },
          {
            id: 'transportation-layer',
            type: 'line',
            source: 'vector-tiles',
            'source-layer': 'transportation',
            paint: {
              'line-color': [
                'match',
                ['get', 'class'],
                'motorway',
                'hsl(0, 80%, 60%)',
                'trunk',
                'hsl(30, 80%, 60%)',
                'primary',
                'hsl(60, 80%, 60%)',
                'secondary',
                'hsl(90, 80%, 60%)',
                'tertiary',
                'hsl(120, 80%, 60%)',
                'hsl(0, 0%, 80%)', // Default color
              ],
              'line-width': [
                'match',
                ['get', 'class'],
                'motorway',
                1.2,
                'trunk',
                1,
                'primary',
                0.8,
                'secondary',
                0.9,
                'tertiary',
                1,
                0.6, // Default width
              ],
            },
          },
          {
            id: 'wetland-areas',
            type: 'fill',
            source: 'vector-tiles',
            'source-layer': 'landcover',
            filter: [
              'all',
              ['==', ['get', 'class'], 'wetland'],
              ['==', ['get', 'subclass'], 'wetland'],
            ],
            paint: {
              'fill-color': '#047802', // Dark green
              'fill-opacity': 0.7,
              'fill-outline-color': '#1B5E20',
            },
          },
        ],
      },
      center: center,
      zoom: zoom,
      scrollZoom: false,
      // center: center, // Center of Bangladesh
      // zoom: 6.2,
      // bounds: [
      //   [88.0, 20.5], // southwest corner (lng, lat)
      //   [92.7, 27.0]  // northeast corner (lng, lat)
      // ],
      // fitBoundsOptions: {
      //   padding: 20
      // },
      attributionControl: false,
      crossSourceCollisions: false,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
    this.map.on('load', () => {
      this.map.addSource('bd-divisions', { type: 'geojson', data: divisions });
      this.map.addSource('bd-districts', { type: 'geojson', data: districts });
      this.map.addSource('district-labels', {
        type: 'geojson',
        data: districtLables,
      });

      this.map.fitBounds(this.bdBounds, {
        padding: 10, // Add some padding
        maxZoom: 8, // Maximum zoom level to use
      });

      this.map.addLayer({
        id: 'division-fill',
        type: 'fill',
        source: 'bd-divisions',
        minzoom: 0,
        maxzoom: 5,
        paint: {
          'fill-color': [
            'match',
            ['get', 'shapeName'],
            'Dhaka',
            '#f44336',
            'Chittagong',
            '#2196f3',
            'Sylhet',
            '#4caf50',
            'Khulna',
            '#ff9800',
            'Barisal',
            '#1007b0',
            'Rajshani',
            '#3f51b5',
            'Rangpur',
            '#009688',
            'Mymensingh',
            '#9c27b0',
            '#bdbdbd',
          ],
          'fill-opacity': 0.5,
          'fill-outline-color': '#FFFFFF',
        },
      });

      this.map.addLayer({
        id: 'district-fill',
        type: 'fill',
        source: 'bd-districts',
        minzoom: 5,
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.5,
          'fill-outline-color': '#999',
        },
      });

      // this.map.addLayer({
      //   id: 'state-labels-layer', // Give it a unique ID
      //   type: 'symbol',
      //   source: 'vector-tiles',
      //   'source-layer': 'place',
      //   minzoom: 0,
      //   maxzoom: 4,
      //   filter: ['==', 'class', 'state'], // Filter to only show labels for state features
      //   layout: {
      //     'text-field': ['get', 'name:en'],
      //     'text-font': ['Noto Sans Bengali Regular'], // Choose appropriate Latin fonts
      //     'text-size': 8, // Adjust the size as needed
      //   },
      //   paint: {
      //     'text-color': '#000000', // Adjust the color as needed
      //     'text-halo-color': '#FFFFFF',
      //     'text-halo-width': 0.5,
      //   },
      // });

      // this.map.addLayer(
      //   {
      //     id: 'district-labels-layer',
      //     type: 'symbol',
      //     source: 'vector-tiles',
      //     'source-layer': 'place',
      //     minzoom: 4,
      //     // maxzoom: 7,
      //     filter: ['==', 'class', 'city'],
      //     // filter: ['match', ['get', 'class'],
      //     //   ['city'], true, false],
      //     layout: {
      //       'text-field': ['get', 'name:en'],
      //       'text-font': ['Noto Sans Bengali Regular'],
      //       'text-size': 14,
      //       'text-allow-overlap': true,
      //       'text-padding': 2
      //     },
      //     paint: {
      //       'text-color': '#333333', // Adjust the color as needed
      //       'text-halo-color': '#FFFFFF',
      //       'text-halo-width': 1
      //     }
      //   },
      // );

      this.map.addLayer({
        id: 'district-name-labels',
        type: 'symbol',
        source: 'district-labels',
        minzoom: 5,
        layout: {
          'text-field': ['get', 'shapeName'],
          'text-font': ['Noto Sans Bengali Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            12,
            6,
            14,
            10,
            18,
          ],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 0.3,
        },
      });

      if (initialMarkers && initialMarkers.length) {
        initialMarkers.forEach(async (markerData) => {
          await this.addMarkerWithPopup(
            markerData.coordinates,
            markerData.properties
          );
        });
      }

      console.log('Map loaded successfully!');
    });

    this.map.on('click', (event) => {
      const features = this.map.queryRenderedFeatures(event.point);
      console.log('Clicked features:', features);
      features.forEach((feature) => {
        console.log('Feature properties:', feature.properties);
      });
    });

    // this.map.addControl(this.exportControl, 'top-right');
    return true;
  }

  createDistrictLabelPoints(districtsGeoJSON: any): any {
    const labelFeatures = districtsGeoJSON.features.map((feature: any) => {
      const center = centroid(feature);
      center.properties.shapeName = feature.properties.shapeName;
      return center;
    });

    return {
      type: 'FeatureCollection',
      features: labelFeatures,
    };
  }
  addMarker(
    coordinates: maplibregl.LngLatLike,
    properties: any
  ): maplibregl.Marker {
    const el = document.createElement('div');
    el.className = 'numbered-pin-marker';

    const number = this.numberFormat(properties?.number || 0);

    el.innerHTML = `
    <div class="pin">
      <div class="number">
        <div class="value">
          ${number}
        </div>
      </div>
    </div>
  `;

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(coordinates)
      .setPopup(
        new maplibregl.Popup({ offset: 30 }).setText(
          properties.name || 'Marker'
        )
      )
      .addTo(this.map);

    return marker;

    // const marker = new maplibregl.Marker({
    //   draggable: false,
    //   color: '#FF0000'
    // })
    //   .setLngLat(coordinates)
    //   .addTo(this.map);

    // this.markers.push(marker);
    // return marker;
  }

  numberFormat(num: number): string {
    if (num === null || num === undefined) return '';
    return Intl.NumberFormat('bn-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  private activePopupMarker: maplibregl.Marker | null = null;

  async addMarkerWithPopup(
    coordinates: maplibregl.LngLatLike,
    properties: any,
    isActiveHover: boolean = false
  ): Promise<maplibregl.Marker> {
    const marker = this.addMarker(coordinates, {
      name: properties?.name || 'custom name',
      number: properties?.number || '12',
    });

    if (isActiveHover) {
      // Hover functionality
      let hideTimeout: any;
      const markerEl = marker.getElement();

      const popupContent = this.createPopupContent(properties);

      // Create the popup separately so we can track its element
      const popup = new maplibregl.Popup({
        offset: 25,
        closeOnClick: false,
        closeButton: false,
        className: 'custom-popup',
      }).setDOMContent(popupContent);

      const showPopup = () => {
        clearTimeout(hideTimeout);
        if (!popup.isOpen()) {
          popup.setLngLat(coordinates).addTo(this.map);
        }
        this.activePopupMarker = marker;
      };

      const hidePopup = () => {
        hideTimeout = setTimeout(() => {
          if (popup.isOpen()) {
            popup.remove();
          }
          if (this.activePopupMarker === marker) {
            this.activePopupMarker = null;
          }
        }, 300);
      };

      // Marker hover
      markerEl.addEventListener('mouseenter', showPopup);
      markerEl.addEventListener('mouseleave', hidePopup);

      // Also attach events to the popup DOM to prevent flickering
      popupContent.addEventListener('mouseenter', () =>
        clearTimeout(hideTimeout)
      );
      popupContent.addEventListener('mouseleave', hidePopup);
    }

    this.markers.push(marker);
    return marker;
  }

  private createPopupContent(properties: any): HTMLElement {
    const popupEl = document.createElement('div');
    popupEl.className = 'marker-popup';

    const title = document.createElement('h3');
    title.textContent = properties.title || 'Location';
    popupEl.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = properties.description || '';
    popupEl.appendChild(desc);

    const type = document.createElement('div');
    type.className = 'marker-type';
    type.textContent = `Type: ${properties.type || 'unknown'}`;
    popupEl.appendChild(type);

    return popupEl;
  }

  async loadMapSources(): Promise<{
    divisions: any;
    districts: any;
    districtLables: any;
  }> {
    const [divisions, districts, districtLables] = await Promise.all([
      fetch('assets/geojson/geoBoundaries-BGD-ADM1.geojson').then((res) =>
        res.json()
      ),
      fetch('assets/geojson/geoBoundaries-BGD-ADM2.geojson').then((res) =>
        res.json()
      ),
      fetch('assets/geojson/dis_lable.geojson').then((res) => res.json()),
    ]);
    districts.features.forEach((f) => {
      f.properties.color =
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0');
    });

    return { divisions, districts, districtLables };
  }

  async downloadMapWithMarkersAsPDF(
    containerId: string,
    table?: ElementRef,
    filename: string = 'map.pdf',
    dt: any = {},
    title?: string,
    comments?: string
  ): Promise<any> {
    const isCrime = dt?.type === 'CRIME' || dt?.type === undefined;

    // Create and show loading overlay (unchanged)
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';

    const spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);

    const text = document.createElement('div');
    text.textContent = 'ডাউনলোড হচ্ছে...';
    text.style.color = 'white';
    text.style.marginLeft = '15px';
    text.style.fontFamily = 'kalpurush, sans-serif';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.appendChild(spinner);
    container.appendChild(text);

    loadingOverlay.appendChild(container);
    document.body.appendChild(loadingOverlay);

    try {
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) throw new Error('Map container not found');

      console.log(
        `tiles loaded=> ${this.map.areTilesLoaded()}, styles loaded=> ${this.map.isStyleLoaded()}`
      );
      const zoom = this.map.getZoom();
      this.map.setZoom(zoom);
      await new Promise((resolve) => {
        this.map.once('idle', () => {
          resolve(true);
        });
      });

      const mapCanvas = await html2canvas(mapContainer, {
        useCORS: true,
        backgroundColor: null,
        logging: false,
        scale: 2,
      });
      const mapImageData = mapCanvas.toDataURL('image/png');

      let pdf = new jsPDF({
        orientation: isCrime ? 'p' : 'l',
        unit: 'mm',
        format: 'a4',
      });

      addKalpurushFont(pdf);
      pdf.setFont('kalpurush', "normal");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const pxToMM = 0.264583;
      let currentY = margin;

      // pdf = await this.setCoustomCmt(pdf, title, currentY, pageWidth, true);

      const hd = document.createElement('div');
      hd.innerText = title;
      hd.style.fontFamily = 'kalpurush, Noto Serif Bengali, sans-serif';
      hd.style.fontSize = '12px';
      // hd.style.fontWeight = 'bold';
      hd.style.textAlign = 'center';
      hd.style.padding = '2px';
      hd.style.width = `${(pageWidth - 2 * margin) * 3.7795}px`;
      document.body.appendChild(hd);

      const hc = await html2canvas(hd, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const hi = hc.toDataURL('image/png');
      document.body.removeChild(hd);

      const hh = hc.height * 0.264583;

      pdf.addImage(
        hi,
        'PNG',
        margin,
        currentY,
        pageWidth - 2 * margin,
        hh
      );

      currentY += hh;







      if (isCrime) {
        const imgHeight = pageHeight * 0.65;
        pdf.addImage(
          mapImageData,
          'PNG',
          margin,
          currentY,
          pageWidth - 2 * margin,
          imgHeight
        );
        currentY += imgHeight + margin;

        [pdf, currentY] = await this.setStaticData(
          pdf,
          dt,
          currentY,
          margin,
          pxToMM,
          pageWidth,
          pageHeight
        );
      } else {
        const totalCards = dt.detailsValue?.length || 0;
        const maxCardsPerSide = 5;
        const cardsLeft =
          dt.detailsValue?.slice(0, Math.min(maxCardsPerSide, totalCards)) ||
          [];
        //    const cardsRight = dt.detailsValue?.slice(maxCardsPerSide, cardsBesideMap) || [];
        const cardsRight =
          dt.detailsValue?.slice(maxCardsPerSide, maxCardsPerSide * 2) || [];
        // const cardsBelow = dt.detailsValue?.slice(cardsBesideMap) || [];
        const cardsBelow = dt.detailsValue?.slice(maxCardsPerSide * 2) || [];
        // Layout dimensions
        const cardWidth = (pageWidth - 2 * margin) * 0.25;
        const mapWidth = (pageWidth - 2 * margin) * 0.50;
        const mapHeight = pageHeight * 0.45;

        const tempContainer = document.createElement('div');
        tempContainer.style.width = `${(pageWidth - 2 * margin) * 3.7795}px`;
        tempContainer.style.display = 'flex';
        tempContainer.style.alignItems = 'flex-start';
        tempContainer.style.gap = '0px';
        document.body.appendChild(tempContainer);

        const leftColumn = this.createElementWithStyles('div', {
          width: `${cardWidth * 3.7795}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          paddingLeft: '2px',
        });

        cardsLeft.forEach((item: any) => {
          const card = this.createElementWithStyles('div', {
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '2px', // Tighter margin
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          });

          const occurseDate = this.createElementWithStyles('div', {
            backgroundColor: '#eee',
            color: '#000',
            padding: '1px',
            fontFamily: 'kalpurush, sans-serif',
            fontSize: '7px',
            textAlign: 'center',
          });
          occurseDate.innerHTML = `তারিখ: ${this._dateFormaterService.formatToBengaliDate(item.occurseDate) ||
            'N/A'
            }`;
          card.appendChild(occurseDate);

          const content = this.createElementWithStyles('div', {
            padding: '3px',
            fontFamily: 'kalpurush, sans-serif',
            fontSize: '7px',
            lineHeight: '1.1',
          });

          content.appendChild(
            this.createField('দলের নাম', item.politicalPartyName)
          );
          content.appendChild(this.createField('স্থান', item.locationName));
          if (item.overView) {
            content.appendChild(this.createField('কর্মসূচি', item.overView));
          }
          if (item.presenceNumber) {
            content.appendChild(
              this.createField(
                'উপস্থিতি',
                this._dateFormaterService.toBengaliNumerals(item.presenceNumber)
              )
            );
          }
          content.appendChild(
            this.createField(
              'সময়',
              this._dateFormaterService.formateTime(item.time)
            )
          );

          card.appendChild(content);
          leftColumn.appendChild(card);
        });

        const mapContainerDiv = this.createElementWithStyles('div', {
          width: `${mapWidth * 3.7795}px`,
          height: `${mapHeight * 3.7795}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        });

        const mapImg = document.createElement('img');
        mapImg.src = mapImageData;
        mapImg.style.width = '100%';
        mapImg.style.height = '100%';
        mapImg.style.objectFit = 'contain';
        mapContainerDiv.appendChild(mapImg);

        const rightColumn = this.createElementWithStyles('div', {
          width: `${cardWidth * 3.7795}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          paddingLeft: '2px',
        });

        cardsRight.forEach((item: any) => {
          const card = this.createElementWithStyles('div', {
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          });

          const occurseDate = this.createElementWithStyles('div', {
            backgroundColor: '#eee',
            color: '#000',
            padding: '1px',
            fontFamily: 'kalpurush, sans-serif',
            fontSize: '7px',
            textAlign: 'center',
          });
          occurseDate.innerHTML = `তারিখ: ${this._dateFormaterService.formatToBengaliDate(item.occurseDate) ||
            'N/A'
            }`;
          card.appendChild(occurseDate);

          const content = this.createElementWithStyles('div', {
            padding: '3px',
            fontFamily: 'kalpurush, sans-serif',
            fontSize: '7px',
          });

          content.appendChild(
            this.createField('দলের নাম', item.politicalPartyName)
          );
          content.appendChild(this.createField('স্থান', item.locationName));
          content.appendChild(this.createField('কর্মসূচি', item.overView));
          content.appendChild(
            this.createField(
              'উপস্থিতি ',
              this._dateFormaterService.toBengaliNumerals(item.presenceNumber)
            )
          );
          content.appendChild(
            this.createField(
              'সময়',
              this._dateFormaterService.formateTime(item.time)
            )
          );

          card.appendChild(content);
          rightColumn.appendChild(card);
        });

        // Assemble first page layout
        tempContainer.appendChild(leftColumn);
        tempContainer.appendChild(mapContainerDiv);
        tempContainer.appendChild(rightColumn);

        // Render first page content
        const canvas = await html2canvas(tempContainer, { scale: 2 });
        const canvasHeightMM = canvas.height * pxToMM;

        // Ensure content fits on first page
        if (currentY + canvasHeightMM > pageHeight - margin) {
          console.warn(
            'Content may not fit on first page. Consider further reducing card sizes.'
          );
        }

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          currentY,
          pageWidth - 2 * margin,
          canvasHeightMM
        );

        document.body.removeChild(tempContainer);
        currentY += canvasHeightMM + margin;

        // Render additional cards
        if (cardsBelow.length > 0) {
          pdf.addPage();
          currentY = margin;

          pdf.setFontSize(10);
          currentY += 6;

          const cardsPerPage = 18;
          const cardsPerRow = 3;

          for (let i = 0; i < cardsBelow.length; i += cardsPerPage) {
            const pageCards = cardsBelow.slice(i, i + cardsPerPage);
            const rowCount = Math.ceil(pageCards.length / cardsPerRow);

            for (let row = 0; row < rowCount; row++) {
              const rowCards = pageCards.slice(
                row * cardsPerRow,
                (row + 1) * cardsPerRow
              );
              const rowContainer = document.createElement('div');
              rowContainer.style.width = `${(pageWidth - 2 * margin) * 3.7795
                }px`;
              rowContainer.style.display = 'flex';
              rowContainer.style.gap = '3px';
              document.body.appendChild(rowContainer);

              rowCards.forEach((item: any) => {
                const card = this.createElementWithStyles('div', {
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '2px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                });

                const occurseDate = this.createElementWithStyles('div', {
                  backgroundColor: '#eee',
                  color: '#000',
                  padding: '1px',
                  fontFamily: 'kalpurush, sans-serif',
                  fontSize: '7px',
                  textAlign: 'center',
                });
                occurseDate.innerHTML = `তারিখ: ${this._dateFormaterService.formatToBengaliDate(
                  item.occurseDate
                ) || 'N/A'
                  }`;
                card.appendChild(occurseDate);

                const content = this.createElementWithStyles('div', {
                  padding: '3px',
                  fontFamily: 'kalpurush, sans-serif',
                  fontSize: '8px',
                });

                content.appendChild(
                  this.createField('দলের নাম', item.politicalPartyName)
                );
                content.appendChild(
                  this.createField('স্থান', item.locationName)
                );
                content.appendChild(
                  this.createField('কর্মসূচি', item.overView)
                );
                content.appendChild(
                  this.createField(
                    'উপস্থিতি ',
                    this._dateFormaterService.toBengaliNumerals(
                      item.presenceNumber
                    )
                  )
                );
                content.appendChild(
                  this.createField(
                    'সময়',
                    this._dateFormaterService.formateTime(item.time)
                  )
                );

                card.appendChild(content);
                rowContainer.appendChild(card);
              });

              const canvas = await html2canvas(rowContainer, { scale: 2 });
              const canvasHeightMM = canvas.height * pxToMM;

              if (currentY + canvasHeightMM > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
              }

              pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                margin,
                currentY,
                pageWidth - 2 * margin,
                canvasHeightMM
              );

              currentY += canvasHeightMM + 3;
              document.body.removeChild(rowContainer);
            }
          }
        }

        if (
          dt != undefined &&
          dt.mapData != undefined &&
          dt.mapData.length > 0
        ) {
          [pdf, currentY] = await this.setStaticData(
            pdf,
            dt,
            currentY,
            margin,
            pxToMM,
            pageWidth,
            pageHeight,
            true
          );
        }
      }



      const headingDiv = document.createElement('div');
      headingDiv.innerText = 'অ্যানালাইসিস/মন্তব্য';
      headingDiv.style.fontFamily = 'kalpurush, Noto Serif Bengali, sans-serif';
      headingDiv.style.fontSize = '14px';
      headingDiv.style.fontWeight = 'bold';
      headingDiv.style.textAlign = 'center';
      headingDiv.style.padding = '5px 0';
      headingDiv.style.width = `${(pageWidth - 2 * margin) * 3.7795}px`;
      headingDiv.style.lineHeight = '1.4';
      headingDiv.style.borderBottom = '1px solid #000';
      document.body.appendChild(headingDiv);

      const headingCanvas = await html2canvas(headingDiv, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const headingImage = headingCanvas.toDataURL('image/png');
      document.body.removeChild(headingDiv);

      const headingHeightMM = headingCanvas.height * 0.264583;

      const bufferSpace = 5;
      if (currentY + headingHeightMM + bufferSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }


      pdf.addImage(
        headingImage,
        'PNG',
        margin,
        currentY,
        pageWidth - 2 * margin,
        headingHeightMM
      );

      // currentY += headingHeightMM + 5;
      currentY += headingHeightMM + bufferSpace;


      // pdf = await this.setCoustomCmt(pdf, comments, currentY, pageWidth, false);
      const commentDiv = document.createElement('div');
      commentDiv.innerText = comments;
      commentDiv.style.fontFamily = 'kalpurush, Noto Serif Bengali, sans-serif';
      commentDiv.style.fontSize = '12px';
      commentDiv.style.padding = '5px';
      commentDiv.style.lineHeight = '1.5';
      commentDiv.style.whiteSpace = 'pre-wrap';
      commentDiv.style.wordWrap = 'break-word';
      commentDiv.style.width = `${(pageWidth - 2 * margin) * 3.7795}px`;

      document.body.appendChild(commentDiv);

      const commentCanvas = await html2canvas(commentDiv, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const commentImage = commentCanvas.toDataURL('image/png');
      document.body.removeChild(commentDiv);

      const commentHeightMM = commentCanvas.height * 0.264583;

      if (currentY + commentHeightMM > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.addImage(
        commentImage,
        'PNG',
        margin,
        currentY,
        pageWidth - 2 * margin,
        commentHeightMM
      );
      currentY += commentHeightMM + 5;




      pdf.save(filename);
      document.body.removeChild(loadingOverlay);
      return true;
    } catch (error) {
      console.error('Custom export failed:', error);
      document.body.removeChild(loadingOverlay);
      return error;
    }
  }
  setCoustomCmt(pdf: jsPDF, title: string, currentY: number, pageWidth: number, isCenter: boolean = true): jsPDF | PromiseLike<jsPDF> {
    const canvast = document.createElement('canvas');
    canvast.width = 400;
    canvast.height = 50;
    const ctx = canvast.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 50);
    ctx.fillStyle = 'black';
    ctx.font = '25px kalpurush, Arial';
    ctx.textAlign = isCenter ? 'center' : 'left';
    ctx.fillText(title ?? '', 200, 30);

    const textImage = canvast.toDataURL('image/png');
    return pdf.addImage(textImage, 'PNG', pageWidth / 2 - 20, currentY - 5, 40, 8);
  }
  async setStaticData(
    pdf: jsPDF,
    dt: any,
    currentY: number,
    margin: number,
    pxToMM: number,
    pageWidth: number,
    pageHeight: number,
    isNewPage: boolean = false
  ): Promise<[pdf: jsPDF, currentY: number]> {
    if (isNewPage) {
      currentY = margin;
      pdf.addPage()
    }
    const data = dt.mapData;
    const rowHeight = 15;
    const estimatedRowHeightMM = rowHeight * pxToMM;
    const maxHeightMM = pageHeight - currentY - margin;
    const rowsPerPage = Math.floor(maxHeightMM / estimatedRowHeightMM);
    const totalRows = data.length;
    let start = 0;
    while (start < totalRows) {
      const chunk = data.slice(start, start + rowsPerPage);
      debugger;
      const tableChunk = this.createCrimeTable(
        chunk,
        this._dateFormaterService
      );

      const tempContainer = document.createElement('div');
      // tempContainer.style.width = `${(pageWidth - 2 * margin) * 3.7795}px`;
      tempContainer.style.width = '500px';
      tempContainer.appendChild(tableChunk);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tableChunk, { scale: 2 });
      const imageData = canvas.toDataURL('image/png');
      const canvasHeightMM = canvas.height * pxToMM;

      if (currentY + canvasHeightMM > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.addImage(
        imageData,
        'PNG',
        margin,
        currentY,
        pageWidth - 2 * margin,
        canvasHeightMM
      );
      currentY += canvasHeightMM + margin;

      document.body.removeChild(tempContainer);
      start += rowsPerPage;
    }
    return [pdf, currentY];
  }

  private createCrimeTable(data: any[], formatter: any): HTMLTableElement {
    const table = document.createElement('table');

    // ✅ Compact & centered layout
    table.style.borderCollapse = 'collapse';
    table.style.width = '500px'; // Set fixed width for better visual
    table.style.margin = '0 auto'; // Center the table horizontally
    table.style.fontFamily = 'kalpurush, sans-serif';
    table.style.border = '1px solid #dee2e6';
    table.style.tableLayout = 'fixed'; // Enforces fixed layout

    // Header
    const thead = document.createElement('thead');
    thead.style.fontSize = '14px';
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = '#cfe2ff'; // Bootstrap primary-like

    const headers = ['ক্রমিক', 'জেলা', 'সংখ্যা'];
    const widths = ['60px', '280px', '100px']; // Approx total 440px

    headers.forEach((text, i) => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.border = '1px solid #dee2e6';
      th.style.padding = '3px';
      th.style.width = widths[i];
      th.style.textAlign = 'center';
      th.style.fontWeight = 'bold';
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');

    data.forEach((dt, i) => {
      const tr = document.createElement('tr');
      tr.style.border = '1px solid #dee2e6';
      tr.style.fontSize = '12px';

      const serialTd = document.createElement('td');
      serialTd.textContent = formatter.toBengaliNumerals((i + 1).toString());
      serialTd.style.border = '1px solid #dee2e6';
      serialTd.style.textAlign = 'center';

      const districtTd = document.createElement('td');
      districtTd.textContent = dt['distict'] ?? 'N/A';
      districtTd.style.border = '1px solid #dee2e6';
      districtTd.style.padding = '0 3px';

      const countTd = document.createElement('td');
      countTd.textContent =
        formatter.toBengaliNumerals(dt['countNumber']) ?? 'N/A';
      countTd.style.border = '1px solid #dee2e6';
      countTd.style.textAlign = 'center';

      tr.appendChild(serialTd);
      tr.appendChild(districtTd);
      tr.appendChild(countTd);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
  }

  private createElementWithStyles<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    styles: Partial<CSSStyleDeclaration>
  ): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    Object.assign(el.style, styles);
    return el;
  }

  private createField(
    label: string,
    value: string | number | undefined | null,
    fontFamily = 'kalpurush, sans-serif'
  ): HTMLElement {
    const el = document.createElement('div');
    el.style.margin = '1px 0';
    el.style.fontFamily = fontFamily;
    el.style.wordBreak = 'break-word'; // Allow long words to wrap
    el.style.whiteSpace = 'normal'; // Ensure text wraps normally
    el.style.overflowWrap = 'break-word'; // Break long words
    el.style.display = 'block';
    el.style.lineHeight = '1.1';
    el.innerHTML = `<strong>${label}:</strong> ${value ?? 'N/A'}`;
    return el;
  }
  async renderPdfSection<T>(
    pdf: jsPDF,
    currentY: number,
    pageWidth: number,
    pageHeight: number,
    margin: number,
    title: string,
    dataList: T[],
    cardBuilder: (item: T, index: number) => HTMLElement,
    options: {
      fontFamily?: string;
      cardWidthPercent?: number;
      rowHeightEstimate?: number;
    } = {}
  ): Promise<number> {
    const PX_PER_MM = 3.7795275591;
    const fontFamily = options.fontFamily ?? 'kalpurush, sans-serif';
    const cardWidthPercent = options.cardWidthPercent ?? 45;
    const rowHeight = (options.rowHeightEstimate ?? 50) + 10;
    const cardsPerRow = Math.floor(100 / cardWidthPercent);

    const tempContainer = this.createElementWithStyles('div', {
      width: `${pageWidth * PX_PER_MM}px`,
      padding: '10px',
      fontFamily,
    });
    document.body.appendChild(tempContainer);

    const titleDiv = this.createElementWithStyles('div', {
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0',
      fontFamily,
    });
    titleDiv.innerHTML = title;
    tempContainer.appendChild(titleDiv);

    const titleHeight = 10;
    if (currentY + titleHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    const titleCanvas = await html2canvas(titleDiv, { scale: 2 });
    pdf.addImage(
      titleCanvas.toDataURL('image/png'),
      'PNG',
      margin,
      currentY,
      pageWidth - 2 * margin,
      titleHeight
    );
    currentY += titleHeight + 10;

    // Render Cards
    const cardElements = dataList.map(cardBuilder);

    for (let i = 0; i < cardElements.length; i += cardsPerRow) {
      const row = this.createElementWithStyles('div', {
        display: 'flex',
        gap: '10px',
        width: `${pageWidth * PX_PER_MM}px`,
      });

      for (let j = 0; j < cardsPerRow && i + j < cardElements.length; j++) {
        row.appendChild(cardElements[i + j]);
      }

      if (currentY + rowHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      tempContainer.appendChild(row);
      const rowCanvas = await html2canvas(row, {
        scale: 2,
        useCORS: true,
        backgroundColor: 'white',
      });
      pdf.addImage(
        rowCanvas.toDataURL('image/png'),
        'PNG',
        margin,
        currentY,
        pageWidth - 2 * margin,
        rowHeight
      );
      currentY += rowHeight;
      tempContainer.removeChild(row);
    }

    document.body.removeChild(tempContainer);
    return currentY;
  }

  politicalTableLoad(pdf: jsPDF, imageData: string, value: any) {
    // console.log(Object.keys(typedPdfMake.vfs));
    // console.log('Registered fonts:', Object.keys(typedPdfMake.fonts));
    // console.log('Noto font mapping:', typedPdfMake.fonts['Noto']);

    // Define shared Y position
    const topY = 20;

    const documentDefinition = {
      content: [
        {
          columns: [
            {
              width: '50%',
              table: {
                body: [
                  [
                    { text: 'দল', style: 'tableHeader' },
                    { text: 'স্থান', style: 'tableHeader' },
                  ],
                  ['ছাত্রদল', 'ঢাকা'],
                  ['শিবির', 'চট্টগ্রাম'],
                ],
              },
              layout: 'lightHorizontalLines',
            },
            {
              width: '50%',
              table: {
                body: [
                  [
                    { text: 'পণ্য', style: 'tableHeader' },
                    { text: 'মূল্য', style: 'tableHeader' },
                  ],
                  ['ল্যাপটপ', '৳১২০০'],
                  ['মোবাইল', '৳৮০০'],
                ],
              },
              layout: 'lightHorizontalLines',
            },
          ],
          columnGap: 10,
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#6495ED', // Header bg for first table
          alignment: 'center',
        },
      },
      defaultStyle: {
        font: 'Noto', // or 'kalpurush' if you’ve embedded it
      },
    };

    //pdfMake.createPdf(documentDefinition).download('report.pdf');

    // First Column (Left)
    // autoTable(pdf, {
    //   head: [['দল', 'স্থান']],
    //   body: [
    //     ['ছাত্রদল', 'ঢাকা'],
    //     ['শিবির', 'চট্টগ্রাম']
    //   ],
    //   startY: topY,
    //   margin: { left: 10 }, // Left column
    //   tableWidth: 90, // Half of A4 width (approx)
    //   theme: 'grid',
    //   styles: {
    //     fontSize: 10 ,
    //     font: 'kalpurush',
    //   },
    //   headStyles: { fillColor: [100, 149, 237] }
    // });

    // // Second Column (Right)
    // autoTable(pdf, {
    //   head: [['মূল্য']],
    //   body: [
    //     ['ল্যাপটপ', '৳১২০০'],
    //     ['মোবাইল', '৳৮০০']
    //   ],
    //   startY: topY,
    //   margin: { left: 110 }, // Right column (left + tableWidth + spacing)
    //   tableWidth: 90,
    //   theme: 'grid',
    //   styles: {
    //     fontSize: 10 ,
    //     font: 'NotoSansBengali-Regular',
    //   },
    //   headStyles: { fillColor: [60, 179, 113] }
    // });

    // pdf.save('custom_map.pdf');
  }

  async crimeTableLoad(pdf: jsPDF, imageData: string, table: ElementRef<any>) {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = pageHeight * 0.45;
    const margin = 10;

    // const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();

    // // Use full page width & height minus margins
    // const margin = 10;
    // // const imgWidth = pageWidth - margin * 2;
    // const imgHeight = pageHeight * 0.45;
    // const tblHgt = pageHeight - (imgHeight + margin);
    // // 🖼️ Add map image
    // pdf.addImage(imageData, 'PNG', margin, margin, pageWidth - 2 * margin, imgHeight);

    // // 📋 Add table below the map using autoTable

    // autoTable(pdf, {
    //   startY: imgHeight + margin + 10,
    //   html: table.nativeElement,
    //   // styles: {
    //   //   fontSize: 11,
    //   //   cellPadding: 4,
    //   // },
    //   styles: {
    //     font: 'kalpurush',
    //   },
    //   margin: { left: margin, right: margin },
    // });

    // const fullCanvas = await html2canvas(table.nativeElement, { scale: 2 });

    // // const pdf = new jsPDF('p', 'pt', 'a4');
    // const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();

    // const canvasWidth = fullCanvas.width;
    // const canvasHeight = fullCanvas.height;

    // const ratio = pageWidth / canvasWidth;
    // const pageCanvasHeight = pageHeight / ratio; // how many pixels on original canvas fit per page

    // // let renderedHeight = 0;
    // const imgHeight = pageHeight * 0.45;
    // const margin = 10;
    // let renderedHeight = imgHeight + margin + 10;

    // while (renderedHeight < canvasHeight) {
    //   const pageCanvas = document.createElement('canvas');
    //   pageCanvas.width = canvasWidth;
    //   pageCanvas.height = Math.min(pageCanvasHeight, canvasHeight - renderedHeight);

    //   const ctx = pageCanvas.getContext('2d')!;
    //   ctx.drawImage(
    //     fullCanvas,
    //     0, renderedHeight, // source x, y
    //     canvasWidth, pageCanvas.height, // source width, height
    //     0, 0, // destination x, y
    //     canvasWidth, pageCanvas.height // destination width, height
    //   );

    //   const pageData = pageCanvas.toDataURL('image/png');

    //   if (renderedHeight > 0) pdf.addPage();
    //   pdf.addImage(pageData, 'PNG', margin, imgHeight + margin + 10, pageWidth, (pageCanvas.height * ratio));

    //   renderedHeight += pageCanvasHeight;
    // }

    pdf.addImage(
      imageData,
      'PNG',
      margin,
      margin,
      pageWidth - 2 * margin,
      imgHeight
    );

    const fullCanvas = await html2canvas(table.nativeElement, { scale: 2 });
    const pageData = fullCanvas.toDataURL('image/png');
    pdf.addImage(
      pageData,
      'PNG',
      10,
      imgHeight + 10 + 10,
      pageWidth - 2 * margin,
      fullCanvas.height * 0.45
    );

    pdf.save('custom_map.pdf');
  }

  removeMarkers() {
    // this.markers.forEach(marker => marker.remove());
    this.markers.length = 0;
  }

  getMarkers(): maplibregl.LngLat[] {
    return this.markers.map((marker) => marker.getLngLat());
  }
}

// map.service.ts

export interface MarkerData {
  coordinates: maplibregl.LngLatLike;
  properties: {
    name: string;
    description?: string;
    number: string;
  };
}
