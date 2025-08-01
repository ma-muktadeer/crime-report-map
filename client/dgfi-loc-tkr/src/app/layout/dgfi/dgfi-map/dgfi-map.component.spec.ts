import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgfiMapComponent } from './dgfi-map.component';

describe('DgfiMapComponent', () => {
  let component: DgfiMapComponent;
  let fixture: ComponentFixture<DgfiMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgfiMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DgfiMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
