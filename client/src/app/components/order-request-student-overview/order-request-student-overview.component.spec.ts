import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestStudentOverviewComponent } from './order-request-student-overview.component';

describe('OrderRequestStudentOverviewComponent', () => {
  let component: OrderRequestStudentOverviewComponent;
  let fixture: ComponentFixture<OrderRequestStudentOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequestStudentOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestStudentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
