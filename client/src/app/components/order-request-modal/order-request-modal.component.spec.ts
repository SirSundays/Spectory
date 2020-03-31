import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestModalComponent } from './order-request-modal.component';

describe('OrderRequestModalComponent', () => {
  let component: OrderRequestModalComponent;
  let fixture: ComponentFixture<OrderRequestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
