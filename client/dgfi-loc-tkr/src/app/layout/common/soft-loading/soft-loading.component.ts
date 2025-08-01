import { Component, Input } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-soft-loading',
  imports: [NgxSpinnerModule],
  templateUrl: './soft-loading.component.html',
  styleUrl: './soft-loading.component.scss'
})
export class SoftLoadingComponent {
@Input() loading: boolean = false;

}
