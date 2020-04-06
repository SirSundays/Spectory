import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';

@Component({
  selector: 'app-order-request-allocate',
  templateUrl: './order-request-allocate.component.html',
  styleUrls: ['./order-request-allocate.component.css']
})
export class OrderRequestAllocateComponent implements OnInit {
  requestForm;
  errAfterSubmit = false;
  errMessage = [];

  allPurchaserUser: any = [];

  request_id;
  request_name;

  allocateForm;

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.allocateForm = this.formBuilder.group({
      orderRequest: this.request_id,
      purchaser: ''
    });
    this.userService.getAllPurchaserUser().subscribe(data => {
      this.allPurchaserUser = data['sendUser'];
    });
  }

  submitAllocate(request) {
    if (this.allocateForm.valid) {
      if (confirm(`Do you really want to allocate this request?`)) {
        this.parcelTrackingService.allocateRequest(request).subscribe(
          (data: any) => this.readResponse(data),
          (error: any) => { this.readError(error); }
        );
      }
    } else {
      this.errMessage = [];
      for (var control in this.allocateForm.controls) {
        if (this.allocateForm.get(control).status === 'INVALID') {
          this.errMessage.push(this.ucFirst(control) + ' is required!');
        }
      };
      if (request.state === '') {
        this.errMessage.push('Accept or decline is required!');
      }
      this.errAfterSubmit = true;
    }
  }

  ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("Allocated successfully!");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/order-request/overview']);
    });
    this.activeModal.close('Close click');
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }
}
