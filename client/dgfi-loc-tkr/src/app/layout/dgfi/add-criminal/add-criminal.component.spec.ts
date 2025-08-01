import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCriminalComponent } from './xadd-criminal.component';

describe('AddCriminalComponent', () => {
  let component: AddCriminalComponent;
  let fixture: ComponentFixture<AddCriminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCriminalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCriminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
