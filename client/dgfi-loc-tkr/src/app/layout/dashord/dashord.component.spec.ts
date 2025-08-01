import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashordComponent } from './dashord.component';

describe('DashordComponent', () => {
  let component: DashordComponent;
  let fixture: ComponentFixture<DashordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
