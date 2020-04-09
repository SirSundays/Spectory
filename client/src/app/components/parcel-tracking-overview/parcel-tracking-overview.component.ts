import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParcelTrackingService } from 'src/app/service/parcelTracking/parcel-tracking.service';
import { ParcelTrackingModalComponent } from '../parcel-tracking-modal/parcel-tracking-modal.component';
import { ParcelTrackingDetailComponent } from '../parcel-tracking-detail/parcel-tracking-detail.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ParcelTrackingMoreInfoComponent } from '../parcel-tracking-more-info/parcel-tracking-more-info.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parcel-tracking-overview',
  templateUrl: './parcel-tracking-overview.component.html',
  styleUrls: ['./parcel-tracking-overview.component.css']
})
export class ParcelTrackingOverviewComponent implements OnInit {
  errAfterSubmit = false;
  errMessage = [];

  constructor(private parcelTrackingService: ParcelTrackingService, private userService: UserService, private formBuilder: FormBuilder, private modalService: NgbModal, public router: Router, private route: ActivatedRoute) { }

  all_parcels = [];

  roles = [];

  myMail;

  id;

  searchForm;

  async ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: '',
      mine: false,
      sort: 'created DESC'
    });
    this.parcelTrackingService.getAllParcels().subscribe(data => {
      this.all_parcels = data['results'];
    });
    this.roles = this.userService.getUserRoles();
    this.myMail = await this.userService.getOwnEmail();
    this.myMail = this.myMail.email;

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id != undefined) {
        this.showParcelDeatils(this.id);
      }
    });
  }

  addParcel() {
    const modalRef = this.modalService.open(ParcelTrackingModalComponent, {size: 'xl', backdrop: 'static', scrollable: true});
  }

  showParcelDeatils(id) {
    const modalRef = this.modalService.open(ParcelTrackingDetailComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.parcel_id = id;
  }

  showParcelMoreInfo(id, name) {
    const modalRef = this.modalService.open(ParcelTrackingMoreInfoComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.parcel_id = id;
    modalRef.componentInstance.parcel_name = name;
  }

  parcelOrdered(id, name) {
    if(confirm(`Did you order this item (${name})?`)) {
      this.parcelTrackingService.updateParcelOrdered(id).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => { this.readError(error); }
      );
    }
  }

  parcelDelivered(id, name) {
    if(confirm(`Did you recieve this item (${name})?`)) {
      this.parcelTrackingService.updateParcelDelivered(id).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => { this.readError(error); }
      );
    }
  }

  searchParcels(search) {
    this.parcelTrackingService.getAllParcelsSearch(search).subscribe(data => {
      this.all_parcels = data['results'];
    });
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("Successfully saved!");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/parcel-tracking/overview']);
    });
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }
}