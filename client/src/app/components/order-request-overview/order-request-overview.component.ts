import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/service/user/user.service';

import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { OrderRequestModalComponent } from '../order-request-modal/order-request-modal.component';
import { OrderRequestDetailModalComponent } from '../order-request-detail-modal/order-request-detail-modal.component';
import { OrderRequestProcessComponent } from '../order-request-process/order-request-process.component';
import { OrderRequestAllocateComponent } from '../order-request-allocate/order-request-allocate.component';

@Component({
  selector: 'app-order-request-overview',
  templateUrl: './order-request-overview.component.html',
  styleUrls: ['./order-request-overview.component.css']
})

export class OrderRequestOverviewComponent implements OnInit {

  constructor(private orderRequestService: OrderRequestService, private userService: UserService, private modalService: NgbModal) { }

  all_requests = [];

  roles = [];

  ngOnInit(): void {
    this.orderRequestService.getAllRequests().subscribe(data => {
      this.all_requests = data['all'];
    });
    this.roles = this.userService.getUserRoles();
  }

  addRequest() {
    const modalRef = this.modalService.open(OrderRequestModalComponent, {size: 'xl', backdrop: 'static', scrollable: true});
  }

  showRequestDeatils(id) {
    const modalRef = this.modalService.open(OrderRequestDetailModalComponent, {size: 'xl', backdrop: 'static', scrollable: true});
    modalRef.componentInstance.request_id = id;
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