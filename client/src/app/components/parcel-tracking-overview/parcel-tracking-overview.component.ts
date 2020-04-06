import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderRequestDetailModalComponent } from '../order-request-detail-modal/order-request-detail-modal.component';
import { OrderRequestProcessComponent } from '../order-request-process/order-request-process.component';
import { OrderRequestAllocateComponent } from '../order-request-allocate/order-request-allocate.component';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';
import { ParcelTrackingModalComponent } from '../parcel-tracking-modal/parcel-tracking-modal.component';
import { ParcelTrackingDetailComponent } from '../parcel-tracking-detail/parcel-tracking-detail.component';

@Component({
  selector: 'app-parcel-tracking-overview',
  templateUrl: './parcel-tracking-overview.component.html',
  styleUrls: ['./parcel-tracking-overview.component.css']
})
export class ParcelTrackingOverviewComponent implements OnInit {

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private modalService: NgbModal) { }

  all_parcels = [];

  roles = [];

  ngOnInit(): void {
    this.parcelTrackingService.getAllParcels().subscribe(data => {
      this.all_parcels = data['all'];
    });
    this.roles = this.userService.getUserRoles();
  }

  addParcel() {
    const modalRef = this.modalService.open(ParcelTrackingModalComponent, {size: 'xl', backdrop: 'static', scrollable: true});
  }

  showParcelDeatils(id) {
    const modalRef = this.modalService.open(ParcelTrackingDetailComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.parcel_id = id;
  }

  showRequestProcess(id) {
    const modalRef = this.modalService.open(OrderRequestProcessComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.request_id = id;
  }

  showRequestAllocate(id, name) {
    const modalRef = this.modalService.open(OrderRequestAllocateComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.request_id = id;
    modalRef.componentInstance.request_name = name;
  }
}
