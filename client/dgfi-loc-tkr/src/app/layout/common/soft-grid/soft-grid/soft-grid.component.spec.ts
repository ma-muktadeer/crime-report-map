import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftGridComponent } from './soft-grid.component';

describe('SoftGridComponent', () => {
  let component: SoftGridComponent;
  let fixture: ComponentFixture<SoftGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
