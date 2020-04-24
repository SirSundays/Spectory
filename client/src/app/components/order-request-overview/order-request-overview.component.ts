import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/service/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { OrderRequestModalComponent } from '../order-request-modal/order-request-modal.component';
import { OrderRequestDetailModalComponent } from '../order-request-detail-modal/order-request-detail-modal.component';
import { OrderRequestProcessComponent } from '../order-request-process/order-request-process.component';
import { OrderRequestAllocateComponent } from '../order-request-allocate/order-request-allocate.component';
import { ParcelTrackingDetailComponent } from '../parcel-tracking-detail/parcel-tracking-detail.component';
import { OrderRequestStudentModalComponent } from '../order-request-student-modal/order-request-student-modal.component';
import { OrderRequestStudentOverviewComponent } from '../order-request-student-overview/order-request-student-overview.component';

@Component({
  selector: 'app-order-request-overview',
  templateUrl: './order-request-overview.component.html',
  styleUrls: ['./order-request-overview.component.css']
})

export class OrderRequestOverviewComponent implements OnInit {

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, private userService: UserService, private modalService: NgbModal, private route: ActivatedRoute, public router: Router) { }

  all_requests = [];

  roles = [];

  id;

  searchForm;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: '',
      mine: false,
      sort: 'created DESC',
      state: 'all',
      priceMin: '',
      priceMax: '',
      source: ''
    });

    this.orderRequestService.getAllRequests().subscribe(data => {
      this.all_requests = data['results'];
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != undefined) {
          this.showRequestDeatils(this.id);
        }
      });
    });
    this.roles = this.userService.getUserRoles();
  }

  addRequest() {
    const modalRef = this.modalService.open(OrderRequestModalComponent, { size: 'xl', backdrop: 'static', scrollable: true });
  }

  addStudentRequest() {
    const modalRef = this.modalService.open(OrderRequestStudentModalComponent, { size: 'xl', backdrop: 'static', scrollable: true });
  }

  addAsTemplate(id) {
    const out = {
      "id": id
    };
    this.orderRequestService.postNewRequestTemplate(out).subscribe(data => {
      alert("Successfully saved as template.");
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/order-request/overview']);
      });
    });
  }

  showStudentTemplates() {
    const modalRef = this.modalService.open(OrderRequestStudentOverviewComponent, { size: 'xl', backdrop: 'static', scrollable: true });
  }

  showRequestDeatils(id) {
    let request = this.all_requests.find(request => request.ParcelOrderItemId == id);
    if (request.state != "allocated" && request.state != "ordered" && request.state != "archived") {
      const modalRef = this.modalService.open(OrderRequestDetailModalComponent, { size: 'xl', backdrop: 'static', scrollable: true });
      modalRef.componentInstance.request_id = id;
    } else {
      this.showParcelDeatils(id);
    }
  }

  showRequestProcess(id) {
    const modalRef = this.modalService.open(OrderRequestProcessComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.request_id = id;
  }

  showRequestAllocate(id, name) {
    const modalRef = this.modalService.open(OrderRequestAllocateComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.request_id = id;
    modalRef.componentInstance.request_name = name;
  }

  showParcelDeatils(id) {
    const modalRef = this.modalService.open(ParcelTrackingDetailComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parcel_id = id;
  }

  searchRequests(search) {
    this.orderRequestService.getAllRequestsSearch(search).subscribe(data => {
      this.all_requests = data['results'];
    });
  }
}