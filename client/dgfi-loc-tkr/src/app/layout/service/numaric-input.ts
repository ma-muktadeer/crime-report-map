import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appBanglaToEnglish]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BanglaToEnglishDirective),
    multi: true
  }]
})
export class BanglaToEnglishDirective implements ControlValueAccessor {
  private regex = new RegExp(/^[০-৯0-9]*$/);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  


  constructor(private el: ElementRef) {}

  private toBangla(englishNum: string | number): string {
    if(typeof englishNum === 'number'){
      englishNum = englishNum.toString();
    }
    const englishToBangla: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return englishNum.split('').map(char => englishToBangla[char] || char).join('');
  }

  private toEnglish(banglaNum: string | number): string {
    if(typeof banglaNum === 'number'){
      banglaNum = banglaNum.toString();
    }
    const banglaToEnglish: { [key: string]: string } = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return banglaNum.split('').map(char => banglaToEnglish[char] || char).join('');
  }

  private updateDisplay(value: string | number): void {
    this.el.nativeElement.value = this.toBangla(value);
  }

  private updateModel(value: string): void {
    this.onChange(this.toEnglish(value));
    this.onTouched();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (!this.regex.test(value)) {
      value = value.replace(/[^০-৯0-9]/g, '');
      input.value = value;
    }

    this.updateModel(value);
    this.updateDisplay(value);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      this.updateDisplay(value);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');

    if (pastedText) {
      const cleanedText = pastedText.replace(/[^০-৯0-9]/g, '');
      document.execCommand('insertText', false, cleanedText);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft',
      'ArrowRight', 'Delete', 'Enter'
    ];

    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (!/[০-৯0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

}
