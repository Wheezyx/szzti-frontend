import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenterViewComponent } from './renter-view.component';

describe('RenterViewComponent', () => {
  let component: RenterViewComponent;
  let fixture: ComponentFixture<RenterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
