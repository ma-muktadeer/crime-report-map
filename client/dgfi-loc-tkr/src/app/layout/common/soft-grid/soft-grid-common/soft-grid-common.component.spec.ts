import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftGridCommonComponent } from './soft-grid-common.component';

describe('SoftGridCommonComponent', () => {
  let component: SoftGridCommonComponent;
  let fixture: ComponentFixture<SoftGridCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftGridCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftGridCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
