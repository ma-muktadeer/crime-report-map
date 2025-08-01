import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigModifyComponent } from './config-modify.component';

describe('ConfigModifyComponent', () => {
  let component: ConfigModifyComponent;
  let fixture: ComponentFixture<ConfigModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
