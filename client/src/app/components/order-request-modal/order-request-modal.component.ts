import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
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

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, public router: Router) { }

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
      this.orderRequestService.postNewRequest(request).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => { this.readError(error); }
      );
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

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("Neuer Antrag erfolgreich erstellt.");
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
