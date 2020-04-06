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
    purchaser: {
      firstName: '',
      lastName: '',
      email: ''
    },
    link: '',
    receiver: {
      firstName: '',
      lastName: '',
      email: ''
    },
    allocater: {
      firstName: '',
      lastName: '',
      email: ''
    },
    created: '',
    state: '',
    ordered: '',
    expectedDelivery: '',
    trackingNumber: ''
  };

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.parcelTrackingService.getOneSpecificParcel(this.parcel_id).subscribe( async data => {
      this.parcel = data['one'];
      this.parcel.created = new Date(this.parcel.created).toLocaleString();
      try {this.parcel.ordered = new Date(this.parcel.ordered).toLocaleString();} catch (err) {}
    });
  }
}
