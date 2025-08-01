import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { criminal, person, victime } from '../persion';
import { ConfigModifyIconComponent } from "../config-modify-icon/config-modify-icon.component";
import { BanglaToEnglishDirective } from '../../service/numaric-input';

interface ImageInfo {
  imageSrc: string;
  imageName: string;
}

@Component({
  selector: 'app-add-criminal',
  imports: [ReactiveFormsModule, FormsModule, NgbTooltipModule, ConfigModifyIconComponent, ConfigModifyIconComponent, BanglaToEnglishDirective],
  templateUrl: './add-criminal.component.html',
  styleUrl: './add-criminal.component.scss'
})
export class AddCriminalComponent extends Softcafe implements Service, OnInit {
  @ViewChild('staticBackdrop') modalElement!: ElementRef;
  private modalInstance!: Modal;
  victimList = signal<person[]>([{ ...victime }]);
  criminalList = signal<person[]>([{ ...criminal }]);

  crimeChartFrom: FormGroup;

  districtList = signal<any[]>(null);

  upazilaList = signal<any[]>(null);

  crimeList = signal<any[]>(null);

  value1: string = '';

  isEditMode = false;
  currentCrimeId: number | null = null;

  selectedIncidentId: number | null = null;
  disabledSaveBtn: boolean;
  spinnerSaveBtn: boolean;
  routingConfigValue: any;
  modelRef: any;

  files: File[] = [];
  isDragging = signal<boolean>(false);
  isUploading = false;
  divisionList = signal<any[]>(null);

  imageExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif'];
  imageInfo = signal<ImageInfo>(null);

  constructor(private fb: FormBuilder, private cs: CommonService, private route: ActivatedRoute,
    private router: Router) {
    super();

    this.crimeChartFrom = this.fb.group({
      typeOfCrimeId: [null, [Validators.required]],
      occurseDate: [null, [Validators.required]],
      time: ['', [Validators.required]],
      divisionId: [null, [Validators.required]],
      districtId: [{ value: null, disabled: true }, [Validators.required]],
      upazilaId: [{ value: null, disabled: true }],
      injuredNumber: [''],
      deathsNumber: [''],
      victimReligious: [''],
      organizationName: [''],
      overView: [''],
      type: ['CRIME', [Validators.required]]
    });
  }

  submitted = false;

  get f(): { [key: string]: AbstractControl } {
    return this.crimeChartFrom.controls;
  }

  ngOnInit(): void {
    debugger
    const state = history.state;
    let id = state?.id;

    // const p ={injuredNumber:123456789};
    // this.crimeChartFrom.patchValue(p);

    if (id) {
      this.isEditMode = true;
      this.currentCrimeId = id;
      this.loadCrimeData(id);
    }
    this.loadInitLocation();

    this.onLoadCrime()
  }
  loadCrimeData(id: number) {
    const payload = { crimeId: id };

    this.cs.sendRequestAdmin(
      this,
      ActionType.SELECT_BY_ID,
      ContentType.CrimeChart,
      'GET_CRIME_BY_ID',
      payload
    );
  }


  ngAfterViewInit() {
    // Initialize the Bootstrap modal properly
    this.modalInstance = new Modal(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }

  addTableRow(role: string): void {
    debugger
    switch (role) {
      case 'victim':
        this.victimList.update(rows => [...rows, { ...victime }]);
        break;
      case 'mainCharacter':
        this.criminalList.update(rows => [...rows, { ...criminal }]);
        break;
    }
  }

  deleteTableRow(role: string, index: number): void {
    switch (role) {
      case 'victim':
        this.victimList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'mainCharacter':
        this.criminalList.update(rows => rows.filter((_, i) => i !== index));
        break;
    }
  }

  loadInitLocation() {
    const payload = {
      locationType: 'Division',
      parentKey: 73,
    }
    this.sendRequest(payload, 'SELECT_DIVISION');
  }
  loadLocation(event: any, locationType: string, ref: string) {
    debugger
    const payload = {
      locationType: locationType,
      // locationType: 'District',
      parentKey: event.target.value,
    }
    this.sendRequest(payload, ref);
  }

  sendRequest(payload: any, ref: string) {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.CrimeChart, ref, payload);
  }

  // checkField(value: any, title: string, text: string): boolean {
  //   if (!value) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: title,
  //       text: text,
  //       confirmButtonText: 'ঠিক আছে'
  //     });
  //     return false;
  //   }
  //   return true;
  // }


  onSave() {

    let dt: FormData = new FormData();
    debugger
    // const payload: any = this.crimeChartFrom.value;
    const payload = {
      ...this.crimeChartFrom.value,
      type: 'CRIME',
      persons: [
        ...this.victimList(),
        ...this.criminalList(),
      ],
    };
    if (this.isEditMode && this.currentCrimeId) {
      payload.crimeId = this.currentCrimeId;
    }
    this.submitted = true;

    // if (!this.checkField(payload.typeOfCrimeId, 'অপরাধের ধরন নির্ধারিত নয়!', 'অনুগ্রহ করে একটি অপরাধের ধরন নির্বাচন করুন।')) return;
    // if (!this.checkField(payload.occurseDate, 'তারিখ নির্ধারিত নয়!', 'অনুগ্রহ করে একটি সঠিক তারিখ নির্বাচন করুন।')) return;
    // if (!this.checkField(payload.divisionId, 'বিভাগ নির্ধারিত নয়!', 'অনুগ্রহ করে একটি বিভাগ নির্বাচন করুন।')) return;
    // if (!this.checkField(payload.districtId, 'বিভাগ নির্ধারিত নয়!', 'অনুগ্রহ করে একটি জেলা নির্বাচন করুন।')) return;

    this.buildFormData(dt, payload);

    if (this.files) {
      this.files.forEach((f) => dt.append('files', f));
    }

    Swal.fire({
      icon: 'info',
      title: 'মনোযোগ দিন',
      text: 'আপনি কি নিশ্চিতভাবে জমা দিতে চান?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'জমা দিন',
      cancelButtonText: 'না',
    }).then((r) => {
      if (r.isConfirmed) {
        debugger
        // this.cs.sendRequest(this, ActionType.SAVE, ContentType.CrimeChart, "SAVE_UPDATE", payload);
        this.cs.filePostBySecure('/save-criminal', dt, null, 'body', 'text').subscribe({
          next: (res: any) => {
            console.log('save success');
            Swal.fire({
              title: 'সফলভাবে সম্পন্ন!',
              text: 'তথ্য সংরক্ষণ করা হয়েছে।',
              icon: 'success',
              confirmButtonText: 'ঠিক আছে'
            });
            this.crimeChartFrom.reset();
            this.resetValue()
            this.removeFile()
            this.files = [];
            this.submitted = false;
          },
          error: (err: any) => {
            console.log('getting error.', err);
            Swal.fire({
              title: 'Oppssss...',
              text: err?.error,
              icon: 'error',
              confirmButtonText: 'ঠিক আছে'
            });
          }
        });
      }
    });


  }

  private resetValue() {
    this.victimList = signal<person[]>([{ ...victime }]);
    this.criminalList = signal<person[]>([{ ...criminal }]);
  }

  buildFormData = (formData: FormData, payload: any, parentKey: string | null = null): void => {
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key; // use dot notation

      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            this.buildFormData(formData, item, `${fullKey}[${index}]`); // keep index in brackets
          } else {
            formData.append(`${fullKey}[${index}]`, item);
          }
        });
      } else if (typeof value === 'object') {
        this.buildFormData(formData, value, fullKey);
      } else {
        formData.append(fullKey, value);
      }
    });
  };

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

  onUnderstood() {
    // Your custom logic here
    if (!this.value1) {
      return;
    }

    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপনি কি তথ্যটি সংরক্ষণ করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, সংরক্ষণ করুন',
      cancelButtonText: 'না, বাতিল করুন'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload: any = {
          value1: this.value1,
          configGroup: "CRIME_GROUP",
          configSubGroup: "CRIME_SUB_GROUP",

        };
        this.cs.sendRequestAdmin(this, ActionType.NEW, ContentType.SConfiguration, "SAVE", payload);
      }
    });
  }

  onLoadCrime() {

    let payload: any = {
      configGroup: "CRIME_GROUP",
      configSubGroup: "CRIME_SUB_GROUP",
    };

    this.cs.sendRequestAdmin(this, ActionType.SELECT_2, ContentType.SConfiguration, 'select', payload);

  }

  // Handle drag over event
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => true);
  }

  // Handle drag leave event
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => false);
  }

  // Handle drop event
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => false);

    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onConfigModify($event){
    console.log($event)
    if($event){
      this.crimeList.update(()=>$event)
      console.log(this.crimeList());
    }
  }

  // Handle file selection via input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  // Process dropped/selected files
  private handleFiles(fileList: File[]) {

    if (fileList.length > 1) {
      Swal.fire({
        icon: 'warning',
        title: 'একাধিক ফাইল ড্রপ করা হয়েছে!',
        text: 'অনুগ্রহ করে একবারে একটি ফাইল আপলোড করুন।',
        confirmButtonText: 'ঠিক আছে'
      });
      return;
    }
    else if (fileList.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'কোনো ফাইল ড্রপ করা হয়নি!',
        text: 'অনুগ্রহ করে একটি ফাইল ড্রপ করুন।',
        confirmButtonText: 'ঠিক আছে'
      });
      return;
    } else if (!this.imageExtensions.includes(`.${fileList[0].name.split('.').pop()?.toLowerCase()}` || '')) {
      Swal.fire({
        icon: 'warning',
        title: 'ছবি আপলোড করা যাবে না!',
        text: 'অনুগ্রহ করে একটি ছবি আপলোড করুন।',
        footer: 'সমর্থিত ফাইল এক্সটেনশন: ' + this.imageExtensions.join(', '),
        confirmButtonText: 'ঠিক আছে'
      });
      return;

    }

    if (fileList.length) {
      this.files.length = 0;
      fileList.forEach(f => {
        this.files.push(f);
      });
    }

    this._buildImagePreview(fileList[0]);
  }


  private _buildImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageInfo.update(() => ({ imageSrc: e.target.result as string, imageName: file.name }));
      // this.imageSrc.update(() => e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removeFile(index?: number) {
    if(index){
      this.files.splice(index, 1);
    }else{
      this.files.length = 0;
    }
    this.imageInfo.update(() => null);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (res.header.referance == 'SAVE_UPDATE') {
      console.log(res.payload);
      this.routingConfigValue = res.payload;

      Swal.fire({
        title: "Successfull..!",
        text: "Routing Config Saved Successfully..!",
        icon: "success"
      });
    }
    else if (res.header.referance == 'SELECT_DIVISION') {
      console.log(res.payload);
      this.divisionList.set(res.payload);
    }
    else if (res.header.referance == 'SELECT_DISTRICT') {
      console.log(res.payload);
      this.districtList.set(res.payload);
      this.crimeChartFrom.get('districtId')?.enable();
    }
    else if (res.header.referance == 'SELECT_THANA') {
      console.log(res.payload);
      this.upazilaList.set(res.payload);
      this.crimeChartFrom.get('upazilaId')?.enable();
    }
    else if (res.header.referance == 'select') {
      console.log(res.payload);
      this.crimeList.set(res.payload);
    }
    else if (res.header.referance == 'SAVE') {
      console.log(res.payload);
      this.closeModal();
      Swal.fire({
        title: "সফল হয়েছে!",
        text: "অপরাধের তথ্য সেভ করা হয়েছে।",
        icon: "success"
      }).then(() => {
        this.crimeList.update(() => res.payload);
        this.value1 = null;
      });

    }
    else if (res.header.referance === 'GET_CRIME_BY_ID') {
      const pendingCrimeData = res.payload;
      this.populateFormWithData(pendingCrimeData);
      this.imageInfo.update(() => pendingCrimeData?.imageInfo || null);
      console.log('Populated form with data');
    }

  }

  populateFormWithData(crimeData: any) {
    debugger
    console.log('Populating form with data:', crimeData);
    this.crimeChartFrom.patchValue({
      typeOfCrimeId: crimeData.typeOfCrimeId,
      occurseDate: crimeData.occurseDate ? new Date(crimeData.occurseDate).toISOString().split('T')[0] : '',
      //  occurseDate: crimeData.occurseDate,
      time: crimeData.time,
      divisionId: crimeData.divisionId,
      injuredNumber: crimeData.injuredNumber,
      deathsNumber: crimeData.deathsNumber,
      victimReligious: crimeData.victimReligious,
      organizationName: crimeData.organizationName,
      overView: crimeData.overView,
      type: crimeData.type || 'CRIME',
    });

    if (crimeData.divisionId) {
      this.loadLocation({ target: { value: crimeData.divisionId } }, 'District', 'SELECT_DISTRICT');
    }

    const setupLocationFields = () => {
      if (crimeData.districtId && this.districtList()) {
        this.crimeChartFrom.get('districtId')?.enable();
        this.crimeChartFrom.get('districtId')?.setValue(crimeData.districtId);

        this.loadLocation({ target: { value: crimeData.districtId } }, 'Upazila', 'SELECT_THANA');
      }

      if (crimeData.upazilaId && this.upazilaList()) {
        this.crimeChartFrom.get('upazilaId')?.enable();
        this.crimeChartFrom.get('upazilaId')?.setValue(crimeData.upazilaId);
      }
    };

    setupLocationFields();
    setTimeout(setupLocationFields, 500);

    if (crimeData.persons && Array.isArray(crimeData.persons)) {
      console.log('Processing persons data:', crimeData.persons);

      const victims = crimeData.persons.filter((p: any) => p.type === 'victim');
      const criminals = crimeData.persons.filter((p: any) => p.type === 'criminal');

      console.log('Victims:', victims);
      console.log('Criminals:', criminals);

      if (victims.length > 0) {
        this.victimList.set(victims);
      }

      if (criminals.length > 0) {
        this.criminalList.set(criminals);
      }
    } else {
      console.warn('No persons data found in the crime data');
    }

  }

  onError(service: Service, req: any, res: any) {


  }


  // Upload files (you'll need to implement your own service)

}
