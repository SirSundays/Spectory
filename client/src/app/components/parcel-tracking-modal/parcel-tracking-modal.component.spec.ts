import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackingModalComponent } from './parcel-tracking-modal.component';

describe('ParcelTrackingModalComponent', () => {
  let component: ParcelTrackingModalComponent;
  let fixture: ComponentFixture<ParcelTrackingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelTrackingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelTrackingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
