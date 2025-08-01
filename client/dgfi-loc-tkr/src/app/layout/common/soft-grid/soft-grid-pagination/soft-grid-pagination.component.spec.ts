import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftGridPaginationComponent } from './soft-grid-pagination.component';

describe('SoftGridPaginationComponent', () => {
  let component: SoftGridPaginationComponent;
  let fixture: ComponentFixture<SoftGridPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftGridPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftGridPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
