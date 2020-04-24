import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestStudentQuickCreateComponent } from './order-request-student-quick-create.component';

describe('OrderRequestStudentQuickCreateComponent', () => {
  let component: OrderRequestStudentQuickCreateComponent;
  let fixture: ComponentFixture<OrderRequestStudentQuickCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestStudentQuickCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestStudentQuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
