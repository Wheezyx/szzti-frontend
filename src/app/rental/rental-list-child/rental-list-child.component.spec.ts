import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListChildComponent } from './rental-list-child.component';

describe('RentalListChildComponent', () => {
  let component: RentalListChildComponent;
  let fixture: ComponentFixture<RentalListChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalListChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalListChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
