import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CommonService } from 'src/app/softcafe/service/common.service';
import { Service } from 'src/app/softcafe/service/service';
import Swal from 'sweetalert2';
import { criminal, defendant, guest, person, plaintiff, sponsor, victime } from '../persion';
import { ConfigModifyIconComponent } from '../config-modify-icon/config-modify-icon.component';
import { NgClass } from '@angular/common';
import { BanglaToEnglishDirective } from '../../service/numaric-input';

@Component({
  selector: 'app-add-political',
  imports: [ReactiveFormsModule, FormsModule, NgbTooltipModule, ConfigModifyIconComponent, NgClass, BanglaToEnglishDirective],
  templateUrl: './add-political.component.html',
  styleUrl: './add-political.component.scss'
})
export class AddPoliticalComponent extends Softcafe implements Service, OnInit {

  @ViewChild('staticBackdrop') modalElement!: ElementRef;
  plitcalFrom: FormGroup;


  public multipleTableRowsValue = new Map<string, any[]>();
  private modalInstance!: Modal;
  showOtherInput = signal<boolean>(false)

  showCase = signal<boolean>(false);

  divisionList = signal<any[]>(null);
  districtList = signal<any[]>(null)
  files: File[] = [];
  upazilaList = signal<any[]>(null);
  parliamentarySeat = signal<any[]>([]);
  value1: string = '';
  // private pendingCrimeData: any = null;
  isEditMode = false;
  currentCrimeId: number | null = null;

  guestList = signal<person[]>([{ ...guest }]);
  victimList = signal<person[]>([{ ...victime }]);
  criminalList = signal<person[]>([{ ...criminal }]);
  plaintiffList = signal<person[]>([{ ...plaintiff }]);
  defendantList = signal<person[]>([{ ...defendant }]);
  sponsorList = signal<person[]>([{ ...sponsor }])
  isClick = signal<boolean>(false);
  politicalList = signal<any[]>([]);
  configSubGroup: string;
  configGroup: string;
  politicalPartyList = signal<any[]>([]);
  inputField: string;
  h1: string;
  submitted = false;
  isDragging = signal<boolean>(false);
  imageName: string;
  constructor(
    private fb: FormBuilder,
    private cs: CommonService,
  ) {
    super();
    this.plitcalFrom = this.fb.group({
      partyName: ['', [Validators.required]],
      typeOfCrimeId: [null, [Validators.required]],
      occurseDate: ['', [Validators.required]],
      time: [''],
      divisionId: [null, [Validators.required]],
      districtId: [{ value: null, disabled: true }, [Validators.required]],
      upazilaId: [{ value: null, disabled: true }, [Validators.required]],
      parliamentarySeatId: [null],
      politicalPartyId: [null],
      politicalPartyName: [''],
      injuredNumber: [''],
      deathsNumber: [''],
      locationName: [''],
      presenceNumber: [''],

      overView: [''],
      legalAdministrativeAction: [''],
      type: ['POLITICAL', [Validators.required]],
    });

  }


  ngOnInit(): void {
    debugger
    const state = history.state;
    let id = state?.id;
    if (id) {
      this.isEditMode = true;
      this.currentCrimeId = id;
      this.loadCrimeData(id);
    }

    // this.onLoadPolitical()
    this.loadInitLocation()
    this.loadInitValues();

  }

  ngAfterViewInit() {
    // Initialize the Bootstrap modal properly
    this.modalInstance = new Modal(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }
  onPartyChange(event: any) {
    this.showOtherInput.update(() => event.target?.value == 0);
  }

  onCase(event: any) {
    debugger
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.showCase.update(() => isChecked);
  }


  onConfigModify($event){
    console.log($event)
    if($event){
      this.politicalList.update(()=>$event)
      console.log(this.politicalList);
    }
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

  addTableRow(role: string): void {
    debugger
    switch (role) {
      case 'guest':
        this.guestList.update(rows => [...rows, { ...guest }]);
        break;
      case 'victim':
        this.victimList.update(rows => [...rows, { ...victime }]);
        break;
      case 'mainCharacter':
        this.criminalList.update(rows => [...rows, { ...criminal }]);
        break;
      case 'plaintiff':
        this.plaintiffList.update(rows => [...rows, { ...plaintiff }]);
        break;
      case 'defendant':
        this.defendantList.update(rows => [...rows, { ...defendant }]);
        break;
      case 'sponsor':
        this.sponsorList.update(rows => [...rows, { ...sponsor }]);
        break;

    }
  }

  deleteTableRow(role: string, index: number): void {
    switch (role) {
      case 'guest':
        this.guestList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'victim':
        this.victimList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'mainCharacter':
        this.criminalList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'plaintiff':
        this.plaintiffList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'defendant':
        this.defendantList.update(rows => rows.filter((_, i) => i !== index));
        break;
      case 'sponsor':
        this.sponsorList.update(rows => rows.filter((_, i) => i !== index));
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
  loadLocation(event: any, locationType: string, ref: string, isReset: boolean = true) {
    if (isReset) {
      this.parliamentarySeat.update(() => []);
    }
    debugger
    const payload = {
      locationType: locationType,
      // locationType: 'District',
      parentKey: event.target.value,
    }
    this.sendRequest(payload, ref);

    if (ref === 'SELECT_THANA') {
      this._loadPoliticalSeat(payload);
    }
  }
  private _loadPoliticalSeat(payload: any) {
    if (payload.parentKey) {
      payload.locationType = 'Parliamentary_Seat';
      this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.CrimeChart, 'SELECT_PARLIAMENTARY_SEAT', payload);
    } else {
      this.parliamentarySeat.update(() => []);
    }
  }

  sendRequest(payload: any, ref: string) {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.CrimeChart, ref, payload);
  }

  saveType() {
    if (!this.value1 || this.isClick()) {
      return;
    }

    this.isClick.update(() => true);


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
          configGroup: this.configGroup,
          configSubGroup: this.configSubGroup,

        };
        this.cs.sendRequestAdmin(this, ActionType.NEW, ContentType.SConfiguration, 'SAVE', payload);
      }
    });
  }


  openModal(configGroup: string, configSubGroup: string, h1: string, inputField: string) {
    if (this.modalInstance) {
      this.h1 = h1;
      this.inputField = inputField;
      this.configGroup = configGroup;
      this.configSubGroup = configSubGroup;
      this.modalInstance.show();
    }
  }

  onLoadPolitical() {
    let payload: any = {
      configGroup: "POLITICAL_GROUP",
      configSubGroup: "POLITICAL_SUB_GROUP",
    };

    return this.cs.execute(ActionType.SELECT_2, ContentType.SConfiguration, payload);

  }

  onLoadPolitycalParty() {
    const payload = {
      configGroup: "POLITICAL_PARTY_GROUP",
      configSubGroup: "POLITICAL_PARTY_SUB_GROUP",
    };

    return this.cs.execute(ActionType.SELECT_2, ContentType.SConfiguration, payload);
  }

  loadInitValues() {
    let buildMethd: Observable<Object>[] = [this.onLoadPolitical(), this.onLoadPolitycalParty()];
    forkJoin(buildMethd).subscribe((res: any) => {
      this.politicalList.update(() => res[0].payload);
      this.politicalPartyList.update(() => res[1].payload);
      // this.divisionList.update(() => res[2].payload);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.plitcalFrom.controls;
  }

  checkField(value: any, title: string, text: string): boolean {
    if (!value) {
      Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        confirmButtonText: 'ঠিক আছে'
      });
      return false;
    }
    return true;
  }

  onSave() {
    let dt: FormData = new FormData();
    debugger
    // const payload: any = this.plitcalFrom.value;

    // payload.guests = this.guestList();
    // payload.victims = this.victimList();
    // payload.mainCharacters = this.criminalList();

    const persons = [
      ...this.guestList(),
      ...this.victimList(),
      ...this.criminalList(),
      ...this.sponsorList(),
    ];
    if (this.showCase()) {
      persons.push(...this.plaintiffList());
      persons.push(...this.defendantList());
    }
    const payload = {
      ...this.plitcalFrom.value,
      type: 'POLITICAL',
      persons: persons,
    };
    if (this.isEditMode && this.currentCrimeId) {
      payload.crimeId = this.currentCrimeId;
    }


    // this.submitted = true;
    // if (!this.checkField(payload.partyName, 'দল/সংগঠন লেখা নেই!', 'অনুগ্রহ করে দল/সংগঠন লিখুন')) return;
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
            this.plitcalFrom.reset();
            this._resetValue();
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
        })
      }
    });
  }

  private _resetValue() {
    this.guestList = signal<person[]>([{ ...guest }]);
    this.victimList = signal<person[]>([{ ...victime }]);
    this.criminalList = signal<person[]>([{ ...criminal }]);
    this.plaintiffList = signal<person[]>([{ ...plaintiff }]);
    this.defendantList = signal<person[]>([{ ...defendant }]);
    this.sponsorList = signal<person[]>([{ ...sponsor }])
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

  closeModal() {
    debugger
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  populateFormWithData(crimeData: any) {
    console.log('Populating form with data:', crimeData);
    this.plitcalFrom.patchValue({
      partyName: crimeData.partyName,
      typeOfCrimeId: crimeData.typeOfCrimeId,
      occurseDate: crimeData.occurseDate ? new Date(crimeData.occurseDate).toISOString().split('T')[0] : '',
      // occurseDate: crimeData.occurseDate,
      time: crimeData.time,
      divisionId: crimeData.divisionId,
      parliamentarySeatId: crimeData.parliamentarySeatId,
      politicalPartyId: crimeData.politicalPartyId,
      politicalPartyName: crimeData.politicalPartyName,
      injuredNumber: crimeData.injuredNumber,
      deathsNumber: crimeData.deathsNumber,
      locationName: crimeData.locationName,
      presenceNumber: crimeData.presenceNumber,
      overView: crimeData.overView,
      legalAdministrativeAction: crimeData.legalAdministrativeAction,

      type: crimeData.type || 'POLITICAL',
    });

    if (crimeData.divisionId) {
      this.loadLocation({ target: { value: crimeData.divisionId } }, 'District', 'SELECT_DISTRICT');
    }

    const setupLocationFields = () => {
      if (crimeData.districtId && this.districtList()) {
        this.plitcalFrom.get('districtId')?.enable();
        this.plitcalFrom.get('districtId')?.setValue(crimeData.districtId);

        this.loadLocation({ target: { value: crimeData.districtId } }, 'Upazila', 'SELECT_THANA');
      }

      if (crimeData.upazilaId && this.upazilaList()) {
        this.plitcalFrom.get('upazilaId')?.enable();
        this.plitcalFrom.get('upazilaId')?.setValue(crimeData.upazilaId);
      }
    };

    setupLocationFields();
    setTimeout(setupLocationFields, 500);

    if (crimeData.persons && Array.isArray(crimeData.persons)) {
      console.log('Processing persons data:', crimeData.persons);

      const guests = crimeData.persons.filter((p: any) => p.type === 'guest');
      const victims = crimeData.persons.filter((p: any) => p.type === 'victim');
      const criminals = crimeData.persons.filter((p: any) => p.type === 'criminal');
      const sponsors = crimeData.persons.filter((p: any) => p.type === 'sponsor');

      const plaintiffs = crimeData.persons.filter((p: any) => p.type === 'plaintiff');
      const defendants = crimeData.persons.filter((p: any) => p.type === 'defendant');
      this.showCase.update(() => plaintiffs.length > 0 || defendants.length > 0);

      console.log('Guests:', guests);
      console.log('Victims:', victims);
      console.log('Criminals:', criminals);
      console.log('Plaintiffs:', plaintiffs);
      console.log('Defendants:', defendants);

      if (guests.length > 0) {
        this.guestList.set(guests);
      }

      if (victims.length > 0) {
        this.victimList.set(victims);
      }

      if (criminals.length > 0) {
        this.criminalList.set(criminals);
      }
      if (plaintiffs.length > 0) {
        this.plaintiffList.set(plaintiffs);
      }
      if (defendants.length > 0) {
        this.defendantList.set(defendants);
      }
      if (sponsors.length > 0) {
        this.sponsorList.set(sponsors);
      }

    } else {
      console.warn('No persons data found in the crime data');
    }
  }

  xpopulateFormWithData(crimeData: any) {
    this.plitcalFrom.patchValue({
      partyName: crimeData.partyName,
      typeOfCrimeId: crimeData.typeOfCrimeId,
      occurseDate: crimeData.occurseDate,
      time: crimeData.time,
      divisionId: crimeData.divisionId,
      districtId: crimeData.districtId,
      upazilaId: crimeData.upazilaId,
      parliamentarySeatId: crimeData.parliamentarySeatId,
      politicalPartyId: crimeData.politicalPartyId,
      politicalPartyName: crimeData.politicalPartyName,
      injuredNumber: crimeData.injuredNumber,
      deathsNumber: crimeData.deathsNumber,
      locationName: crimeData.locationName,
      presenceNumber: crimeData.presenceNumber,
      overView: crimeData.overView,
      type: crimeData.type || 'POLITICAL',
    });

    if (crimeData.districtId) {
      this.plitcalFrom.get('districtId')?.enable();
    }
    if (crimeData.upazilaId) {
      this.plitcalFrom.get('upazilaId')?.enable();
    }
  }

  //File upload
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => false);
  }

  imageExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif'];
  imageInfo = signal<ImageInfo>(null);

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.update(() => false);

    if (event.dataTransfer?.files) {

      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
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
    this.isClick.update(() => false);

    if (res.header.referance == 'SELECT_DIVISION') {
      debugger
      console.log(res.payload);
      this.divisionList.set(res.payload);
    }

    // else if (res.header.referance == 'SELECT') {
    //   debugger
    //   console.log(res.payload);
    //   this.politicalList.update(() => res.payload);
    // }

    else if (res.header.referance == 'SELECT_DISTRICT') {
      console.log(res.payload);
      this.districtList.set(res.payload);
      this.plitcalFrom.get('districtId')?.enable();
    }
    else if (res.header.referance == 'SELECT_PARLIAMENTARY_SEAT') {
      console.log(res.payload);
      this.parliamentarySeat.update(() => res.payload);
    }
    else if (res.header.referance == 'SELECT_THANA') {
      console.log(res.payload);
      this.upazilaList.set(res.payload);
      this.plitcalFrom.get('upazilaId')?.enable();
    }
    else if (res.header.referance == 'SAVE') {
      console.log(res.payload);
      this.closeModal();
      Swal.fire({
        title: "সফল হয়েছে!",
        text: "অপরাধের তথ্য সেভ করা হয়েছে।",
        icon: "success"
      }).then(() => {
        if (this.configGroup == 'POLITICAL_GROUP') {
          this.politicalList.update(() => res.payload);
        } else if (this.configGroup == 'POLITICAL_PARTY_GROUP') {
          this.politicalPartyList.update(() => res.payload);
        }
        this.value1 = null;
        this.configGroup = '';
        this.configSubGroup = '';
        this.h1 = '';
        this.inputField = '';
      });
    }
    else if (res.header.referance === 'GET_CRIME_BY_ID') {
      const pendingCrimeData = res.payload;
      this.populateFormWithData(pendingCrimeData);
      debugger
      this.imageInfo.update(() => pendingCrimeData?.imageInfo || null);
      console.log('Populated form with data');
    }

  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}

interface ImageInfo {
  imageSrc: string;
  imageName: string;
}
