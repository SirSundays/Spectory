import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderRequestService } from 'src/app/service/order-request.service';
import { OrderRequestModalComponent } from '../order-request-modal/order-request-modal.component';

@Component({
  selector: 'app-order-request-overview',
  templateUrl: './order-request-overview.component.html',
  styleUrls: ['./order-request-overview.component.css']
})

export class OrderRequestOverviewComponent implements OnInit {

  constructor(private orderRequestService: OrderRequestService, private modalService: NgbModal) { }

  all_requests = [];

  ngOnInit(): void {
    this.orderRequestService.getAllRequests().subscribe(data => {
      this.all_requests = data['all'];
    });
  }

  addRequest() {
    const modalRef = this.modalService.open(OrderRequestModalComponent, {size: 'xl', backdrop: 'static'});
  }
}