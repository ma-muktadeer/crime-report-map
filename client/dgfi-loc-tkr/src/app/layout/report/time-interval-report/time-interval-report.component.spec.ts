import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIntervalReportComponent } from './time-interval-report.component';

describe('TimeIntervalReportComponent', () => {
  let component: TimeIntervalReportComponent;
  let fixture: ComponentFixture<TimeIntervalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeIntervalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIntervalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
