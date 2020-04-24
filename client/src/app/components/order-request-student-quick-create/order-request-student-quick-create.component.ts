import { Component, OnInit } from '@angular/core';
import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-request-student-quick-create',
  templateUrl: './order-request-student-quick-create.component.html',
  styleUrls: ['./order-request-student-quick-create.component.css']
})
export class OrderRequestStudentQuickCreateComponent implements OnInit {
  templateForm;
  errAfterSubmit = false;
  errMessage = [];

  edit_id;

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      orderrequeststudents_id: '',
      name: '',
      quantity: '',
      price: '',
      shipping: '',
      link: ''
    });

    if (this.edit_id) {
      this.orderRequestService.getOneSpecificRequestTemplate(this.edit_id).subscribe(data => {
        data = data["results"]
        this.templateForm.get('orderrequeststudents_id').setValue(this.edit_id);
        this.templateForm.get('name').setValue(data["name"]);
        this.templateForm.get('quantity').setValue(data["quantity"]);
        this.templateForm.get('price').setValue(data["price"]);
        this.templateForm.get('shipping').setValue(data["shipping"]);
        this.templateForm.get('link').setValue(data["link"]);
      });
    }
  }

  submitRequest(template) {
    if (this.templateForm.valid) {
      if (this.edit_id) {
        this.orderRequestService.updateTemplate(template).subscribe(
          (data: any) => this.readResponse(data),
          (error: any) => { this.readError(error); }
        );
      } else {
        this.orderRequestService.postNewRequestTemplateScratch(template).subscribe(
          (data: any) => this.readResponse(data),
          (error: any) => { this.readError(error); }
        );
      }
    } else {
      this.errMessage = [];
      for (var control in this.templateForm.controls) {
        if (this.templateForm.get(control).status === 'INVALID') {
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
    alert("Saved template successfully!");
    this.activeModal.close('Close click');
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }

}
