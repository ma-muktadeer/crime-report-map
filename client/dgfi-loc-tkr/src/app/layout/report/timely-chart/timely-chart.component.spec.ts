import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelyChartComponent } from './timely-chart.component';

describe('TimelyChartComponent', () => {
  let component: TimelyChartComponent;
  let fixture: ComponentFixture<TimelyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelyChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
