import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';
import { UserService } from 'src/app/service/user/user.service';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-tracking-more-info',
  templateUrl: './parcel-tracking-more-info.component.html',
  styleUrls: ['./parcel-tracking-more-info.component.css']
})
export class ParcelTrackingMoreInfoComponent implements OnInit {
  errAfterSubmit = false;
  errMessage = [];

  parcel_id;
  parcel_name;

  infoForm;
  fileToUpload: File = null;

  @ViewChild('labelImport')
  labelImport: ElementRef;

  expected = 0;
  responses = 0;

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

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.infoForm = this.formBuilder.group({
      parcel: this.parcel_id,
      delivery: '',
      tracking: '',
      invoice: [{value: '', disabled: true}]
    });
    this.parcelTrackingService.getOneSpecificParcel(this.parcel_id).subscribe( async data => {
      this.parcel = data['results'];
      let date: NgbDate;
      try {
        let tmp_date = new Date(this.parcel.expectedDelivery);
        date = new NgbDate(tmp_date.getFullYear(), tmp_date.getMonth() + 1, tmp_date.getDate());
      } catch (err) {}
      this.infoForm.patchValue({
        delivery: date,
        tracking: this.parcel.trackingNumber
      });
    });
  }

  submitData(info) {
    if (this.infoForm.valid) {
      this.expected = 0;
      let tmp_date = new Date(this.infoForm.value.delivery.month + ' ' + this.infoForm.value.delivery.day + ', ' + this.infoForm.value.delivery.year);
      this.infoForm.value.delivery = tmp_date.getTime();
      if (this.infoForm.value.tracking != '') {
        this.expected++;
        this.parcelTrackingService.addTracking(this.infoForm.value.parcel, this.infoForm.value.tracking).subscribe(
          (data: any) => {
            this.readResponse(data);
          },
          (error: any) => { this.readError(error); }
        );
      }
      if (this.infoForm.value.delivery != NaN) {
        this.expected++;
        this.parcelTrackingService.addDelivery(this.infoForm.value.parcel, this.infoForm.value.delivery).subscribe(
          (data: any) => {
            this.readResponse(data)
          },
          (error: any) => { this.readError(error); }
        );
      }
    } else {
      this.errMessage = [];
      for (var control in this.infoForm.controls) {
        if (this.infoForm.get(control).status === 'INVALID') {
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
    this.responses++;
    if (this.expected === this.responses) {
      this.errMessage = [];
      alert("Saved successfully!");
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/parcel-tracking/overview']);
      });
      this.activeModal.close('Close click');
    }
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }
}