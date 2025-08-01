import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftLoadingComponent } from './soft-loading.component';

describe('SoftLoadingComponent', () => {
  let component: SoftLoadingComponent;
  let fixture: ComponentFixture<SoftLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
