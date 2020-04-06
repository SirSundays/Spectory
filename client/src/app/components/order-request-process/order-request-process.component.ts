import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { UserService } from 'src/app/service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-request-process',
  templateUrl: './order-request-process.component.html',
  styleUrls: ['./order-request-process.component.css']
})
export class OrderRequestProcessComponent implements OnInit {
  requestForm;
  errAfterSubmit = false;
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
    user: {
      firstName: '',
      lastName: '',
      email: ''
    },
    created: ''
  };

  processForm;

  constructor(private orderRequestService: OrderRequestService, private userService: UserService, private formBuilder: FormBuilder, public activeModal: NgbActiveModal, public router: Router) { }

  ngOnInit(): void {
    this.orderRequestService.getOneSpecificRequest(this.request_id).subscribe(async data => {
      this.request = data['one'];
      this.request.created = new Date(this.request.created).toLocaleString();
    });

    this.processForm = this.formBuilder.group({
      id: this.request_id,
      message: '',
      state: ''
    })
  }

  submitProcess(request) {
    if (this.processForm.valid && request.state != '') {
      if (confirm(`Do you really want to ${request.state} this request?`)) {
        this.orderRequestService.updateRequest(request).subscribe(
          (data: any) => this.readResponse(data),
          (error: any) => { this.readError(error); }
        );
      }
    } else {
      this.errMessage = [];
      for (var control in this.processForm.controls) {
        if (this.processForm.get(control).status === 'INVALID') {
          this.errMessage.push(this.ucFirst(control) + ' is required!');
        }
      };
      if (request.state === '') {
        this.errMessage.push('Accept or decline is required!');
      }
      this.errAfterSubmit = true;
    }
  }

  ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    alert("Submit successfull!");
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
