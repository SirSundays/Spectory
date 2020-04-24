import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderRequestService } from 'src/app/service/order-request/order-request.service';

@Component({
  selector: 'app-order-request-student-modal',
  templateUrl: './order-request-student-modal.component.html',
  styleUrls: ['./order-request-student-modal.component.css']
})
export class OrderRequestStudentModalComponent implements OnInit {
  requestForm;
  errAfterSubmit = false;
  errMessage = [];

  allTemplates = [];

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.orderRequestService.getAllStudentRequestTemplates().subscribe(data => {
      this.allTemplates = data["results"];
    });

    this.requestForm = this.formBuilder.group({
      orderrequeststudents_id: '',
      name: '',
      quantity: 0,
      price: 0,
      shipping: 0,
      reason: '',
      link: '',
      info: ''
    });

    this.onTemplateChange();
  }

  onTemplateChange() {
    this.requestForm.get('orderrequeststudents_id').valueChanges.subscribe(val => {
      const newTemplate = this.allTemplates.find(template => template.orderrequeststudents_id == val);
      this.requestForm.get('name').setValue(newTemplate.name);
      this.requestForm.get('quantity').setValue(newTemplate.quantity);
      this.requestForm.get('price').setValue(newTemplate.price);
      this.requestForm.get('shipping').setValue(newTemplate.shipping);
      this.requestForm.get('link').setValue(newTemplate.link);
    });
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
          if (control == 'orderrequeststudents_id') {
            control = 'Selecting a template';
          }
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
    alert("New request successfull!");
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
