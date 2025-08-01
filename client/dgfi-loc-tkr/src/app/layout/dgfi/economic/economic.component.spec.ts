import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicComponent } from './economic.component';

describe('EconomicComponent', () => {
  let component: EconomicComponent;
  let fixture: ComponentFixture<EconomicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
