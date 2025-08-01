import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigModifyIconComponent } from './config-modify-icon.component';

describe('ConfigModifyIconComponent', () => {
  let component: ConfigModifyIconComponent;
  let fixture: ComponentFixture<ConfigModifyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigModifyIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigModifyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
