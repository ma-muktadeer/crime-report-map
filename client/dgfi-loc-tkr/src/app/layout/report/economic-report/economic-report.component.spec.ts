import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicReportComponent } from './economic-report.component';

describe('EconomicReportComponent', () => {
  let component: EconomicReportComponent;
  let fixture: ComponentFixture<EconomicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
