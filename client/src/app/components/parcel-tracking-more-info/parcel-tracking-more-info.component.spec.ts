import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackingMoreInfoComponent } from './parcel-tracking-more-info.component';

describe('ParcelTrackingMoreInfoComponent', () => {
  let component: ParcelTrackingMoreInfoComponent;
  let fixture: ComponentFixture<ParcelTrackingMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelTrackingMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelTrackingMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
