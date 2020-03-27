import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestOverviewComponent } from './order-request-overview.component';

describe('OrderRequestOverviewComponent', () => {
  let component: OrderRequestOverviewComponent;
  let fixture: ComponentFixture<OrderRequestOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
