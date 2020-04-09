import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';

@Component({
  selector: 'app-parcel-tracking-detail',
  templateUrl: './parcel-tracking-detail.component.html',
  styleUrls: ['./parcel-tracking-detail.component.css']
})
export class ParcelTrackingDetailComponent implements OnInit {
  err = false;
  errMessage = [];

  parcel_id;
  parcel = {
    name: '',
    quantity: '',
    price: '',
    shipping: '',
    purchaser: '',
    purchaserFirstName: '',
    purchaserLastName: '',
    purchaserEmail: '',
    link: '',
    receiver: '',
    receiverFirstName: '',
    receiverLastName: '',
    receiverEmail: '',
    allocater: '',
    allocaterFirstName: '',
    allocaterLastName: '',
    allocaterEmail: '',
    created: '',
    state: '',
    ordered: '',
    expectedDelivery: '',
    trackingNumber: ''
  };

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.parcelTrackingService.getOneSpecificParcel(this.parcel_id).subscribe(async data => {
      this.parcel = data['results'];
      this.parcel.created = new Date(parseInt(this.parcel.created)).toLocaleString();
      try { this.parcel.ordered = new Date(parseInt(this.parcel.ordered)).toLocaleString(); } catch (err) { }
      try { if (this.parcel.expectedDelivery != '') { this.parcel.expectedDelivery = new Date(parseInt(this.parcel.expectedDelivery)).toLocaleDateString() } } catch (err) { }
    });
  }
}
