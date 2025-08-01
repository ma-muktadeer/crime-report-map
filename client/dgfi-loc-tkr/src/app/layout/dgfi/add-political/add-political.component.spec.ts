import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoliticalComponent } from './add-political.component';

describe('AddPoliticalComponent', () => {
  let component: AddPoliticalComponent;
  let fixture: ComponentFixture<AddPoliticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPoliticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPoliticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
