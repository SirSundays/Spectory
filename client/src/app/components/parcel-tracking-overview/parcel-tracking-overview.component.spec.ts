import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackingOverviewComponent } from './parcel-tracking-overview.component';

describe('ParcelTrackingOverviewComponent', () => {
  let component: ParcelTrackingOverviewComponent;
  let fixture: ComponentFixture<ParcelTrackingOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelTrackingOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelTrackingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
