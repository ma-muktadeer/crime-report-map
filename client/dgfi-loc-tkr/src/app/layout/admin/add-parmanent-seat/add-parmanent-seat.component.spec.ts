import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParmanentSeatComponent } from './add-parmanent-seat.component';

describe('AddParmanentSeatComponent', () => {
  let component: AddParmanentSeatComponent;
  let fixture: ComponentFixture<AddParmanentSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParmanentSeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddParmanentSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
