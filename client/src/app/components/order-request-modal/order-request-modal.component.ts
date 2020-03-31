import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OrderRequestService } from 'src/app/service/order-request.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-request-modal',
  templateUrl: './order-request-modal.component.html',
  styleUrls: ['./order-request-modal.component.css']
})
export class OrderRequestModalComponent implements OnInit {
  requestForm;
  errAfterSubmit = false;
  errMessage = [];

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      name: '',
      quantity: '',
      price: '',
      shipping: '',
      reason: '',
      link: '',
      info: ''
    })
  }

  submitRequest(request) {
    if (this.requestForm.valid) {
      console.log(request);
      this.orderRequestService.postNewRequest(request);
    } else {
      this.errMessage = [];
      for (var control in this.requestForm.controls) {
        if (this.requestForm.get(control).status === 'INVALID') {
          this.errMessage.push(this.ucFirst(control) + ' is required!');
        }
      };
      this.errAfterSubmit = true;
    }
  }

  ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

}
