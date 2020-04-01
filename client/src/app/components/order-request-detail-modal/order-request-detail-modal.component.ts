import { Component, OnInit } from '@angular/core';
import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { UserService } from 'src/app/service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-request-detail-modal',
  templateUrl: './order-request-detail-modal.component.html',
  styleUrls: ['./order-request-detail-modal.component.css']
})
export class OrderRequestDetailModalComponent implements OnInit {
  requestForm;
  err = false;
  errMessage = [];

  request_id;
  request = {
    name: '',
    quantity: '',
    price: '',
    shipping: '',
    reason: '',
    link: '',
    info: '',
    user: '',
    created: ''
  };

  fullname = '';

  constructor(private orderRequestService: OrderRequestService, private userService: UserService, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.orderRequestService.getOneSpecificRequest(this.request_id).subscribe( async data => {
      this.request = data['one'];
      this.request.created = new Date(this.request.created).toLocaleString();
      this.userService.getFullName(this.request.user).subscribe(async data => {
        this.fullname = data['firstname'] + ' ' + data['lastname'];
      });
    });
  }
}
