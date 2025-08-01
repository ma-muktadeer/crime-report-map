import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSearchRepComponent } from './common-search-rep.component';

describe('CommonSearchRepComponent', () => {
  let component: CommonSearchRepComponent;
  let fixture: ComponentFixture<CommonSearchRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSearchRepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSearchRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
