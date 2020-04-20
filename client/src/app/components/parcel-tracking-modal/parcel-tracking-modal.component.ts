import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OrderRequestModalImportComponent } from '../order-request-modal-import/order-request-modal-import.component';
import { UserService } from 'src/app/service/user/user.service';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';

@Component({
  selector: 'app-parcel-tracking-modal',
  templateUrl: './parcel-tracking-modal.component.html',
  styleUrls: ['./parcel-tracking-modal.component.css']
})
export class ParcelTrackingModalComponent implements OnInit {

  parcelForm;
  errAfterSubmit = false;
  errMessage = [];

  allPurchaserUser: any = [];
  allBasicUser: any = [];

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.parcelForm = this.formBuilder.group({
      name: '',
      quantity: '',
      price: '',
      shipping: '',
      link: '',
      purchaser: '',
      receiver: ''
    });
    this.userService.getAllPurchaserUser().subscribe(data => {
      this.allPurchaserUser = data['sendUser'];
    });
    this.userService.getAllBasicUser().subscribe(data => {
      this.allBasicUser = data['sendUser'];
    });
  }

  async importRequest() {
    const modalRef = this.modalService.open(OrderRequestModalImportComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    let importRequest = await modalRef.result;
    this.parcelForm.patchValue({
      name: importRequest.name,
      quantity: importRequest.quantity,
      price: importRequest.price,
      shipping: importRequest.shipping,
      link: importRequest.link,
    });
  }

  submitParcel(parcel) {
    if (this.parcelForm.valid) {
      this.parcelTrackingService.postNewParcel(parcel).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => { this.readError(error); }
      );
    } else {
      this.errMessage = [];
      for (var control in this.parcelForm.controls) {
        if (this.parcelForm.get(control).status === 'INVALID') {
          this.errMessage.push(this.ucFirst(control) + ' is required!');
        }
      };
      this.errAfterSubmit = true;
    }
  }

  ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("New ParcelTrack successfull!");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/parcel-tracking/overview']);
    });
    this.activeModal.close('Close click');
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }

}
