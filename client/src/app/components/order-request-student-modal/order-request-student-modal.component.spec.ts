import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestStudentModalComponent } from './order-request-student-modal.component';

describe('OrderRequestStudentModalComponent', () => {
  let component: OrderRequestStudentModalComponent;
  let fixture: ComponentFixture<OrderRequestStudentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestStudentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestStudentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
