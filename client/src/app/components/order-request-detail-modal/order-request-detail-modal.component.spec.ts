import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestDetailModalComponent } from './order-request-detail-modal.component';

describe('OrderRequestDetailModalComponent', () => {
  let component: OrderRequestDetailModalComponent;
  let fixture: ComponentFixture<OrderRequestDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
