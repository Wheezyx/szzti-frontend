import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenterFormComponent } from './renter-form.component';

describe('RenterFormComponent', () => {
  let component: RenterFormComponent;
  let fixture: ComponentFixture<RenterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
