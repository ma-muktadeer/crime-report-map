// Angular import
import { Directive, ElementRef, HostListener } from '@angular/core';

// project import
import screenfull from 'screenfull';

// declare const screenfull: any;

@Directive({
  selector: '[appToggleFullScreen]',
  standalone: true
})
export class ToggleFullScreenDirective {
  // Constructor
  //  private elements = inject(ElementRef);
  constructor(private elements: ElementRef) { }
  // public method
  @HostListener('click')
  onClick() {
    debugger
    if (screenfull.isEnabled) {
      this.elements.nativeElement.querySelector('.feather').classList.toggle('icon-maximize');
      this.elements.nativeElement.querySelector('.feather').classList.toggle('icon-minimize');
      // screenfull.toggle();
      // Toggle fullscreen
      screenfull.toggle().catch(err => {
        console.error('Error trying to enable fullscreen:', err.message);
      });
    }

    if (isScreenFull(screenfull)) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  }
}
function isScreenFull(sf: any): any {
  return sf.isFullscreen;
}
