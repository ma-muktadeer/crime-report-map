import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularReportComponent } from './tabular-report.component';

describe('TabularReportComponent', () => {
  let component: TabularReportComponent;
  let fixture: ComponentFixture<TabularReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabularReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabularReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
