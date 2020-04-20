import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackingDetailComponent } from './parcel-tracking-detail.component';

describe('ParcelTrackingDetailComponent', () => {
  let component: ParcelTrackingDetailComponent;
  let fixture: ComponentFixture<ParcelTrackingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelTrackingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelTrackingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
