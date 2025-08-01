import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriminalListComponent } from './criminal-list.component';

describe('CriminalListComponent', () => {
  let component: CriminalListComponent;
  let fixture: ComponentFixture<CriminalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriminalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriminalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
