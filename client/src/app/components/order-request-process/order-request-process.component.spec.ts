import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestProcessComponent } from './order-request-process.component';

describe('OrderRequestProcessComponent', () => {
  let component: OrderRequestProcessComponent;
  let fixture: ComponentFixture<OrderRequestProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
