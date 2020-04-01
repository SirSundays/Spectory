import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestModalImportComponent } from './order-request-modal-import.component';

describe('OrderRequestModalImportComponent', () => {
  let component: OrderRequestModalImportComponent;
  let fixture: ComponentFixture<OrderRequestModalImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestModalImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestModalImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
