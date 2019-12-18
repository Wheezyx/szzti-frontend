import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionInterfaceFormComponent } from './connection-interface-form.component';

describe('ConnectionInterfaceFormComponent', () => {
  let component: ConnectionInterfaceFormComponent;
  let fixture: ComponentFixture<ConnectionInterfaceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionInterfaceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionInterfaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
