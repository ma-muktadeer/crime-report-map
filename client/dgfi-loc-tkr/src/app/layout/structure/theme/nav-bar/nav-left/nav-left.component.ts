// Angular Import
import { Component, inject } from '@angular/core';
import { ToggleFullScreenDirective } from '../../../../../shared/components/full-screen/toggle-full-screen';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  standalone: false,
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {

  private tgl = inject(ToggleFullScreenDirective);
  click2FullScreen() {
    this.tgl.onClick();
  }
}
