import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestAllocateComponent } from './order-request-allocate.component';

describe('OrderRequestAllocateComponent', () => {
  let component: OrderRequestAllocateComponent;
  let fixture: ComponentFixture<OrderRequestAllocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestAllocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
