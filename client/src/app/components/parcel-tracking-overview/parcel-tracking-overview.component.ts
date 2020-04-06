import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderRequestAllocateComponent } from '../order-request-allocate/order-request-allocate.component';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';
import { ParcelTrackingModalComponent } from '../parcel-tracking-modal/parcel-tracking-modal.component';
import { ParcelTrackingDetailComponent } from '../parcel-tracking-detail/parcel-tracking-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-tracking-overview',
  templateUrl: './parcel-tracking-overview.component.html',
  styleUrls: ['./parcel-tracking-overview.component.css']
})
export class ParcelTrackingOverviewComponent implements OnInit {
  errAfterSubmit = false;
  errMessage = [];

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private modalService: NgbModal, public router: Router) { }

  all_parcels = [];

  roles = [];

  myMail;

  async ngOnInit() {
    this.parcelTrackingService.getAllParcels().subscribe(data => {
      this.all_parcels = data['parcel_out'];
    });
    this.roles = this.userService.getUserRoles();
    this.myMail = await this.userService.getOwnEmail();
    this.myMail = this.myMail.email;
  }

  addParcel() {
    const modalRef = this.modalService.open(ParcelTrackingModalComponent, {size: 'xl', backdrop: 'static', scrollable: true});
  }

  showParcelDeatils(id) {
    const modalRef = this.modalService.open(ParcelTrackingDetailComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.parcel_id = id;
  }

  parcelOrdered(id, name) {
    if(confirm(`Did you ordered this item (${name})?`)) {
      this.parcelTrackingService.updateParcelOrdered(id).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => { this.readError(error); }
      );
    }
  }

  showRequestAllocate(id, name) {
    const modalRef = this.modalService.open(OrderRequestAllocateComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.request_id = id;
    modalRef.componentInstance.request_name = name;
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("Successfully saved!");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/order-request/overview']);
    });
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }
}
