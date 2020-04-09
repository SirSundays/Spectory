import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { OrderRequestDetailModalComponent } from '../order-request-detail-modal/order-request-detail-modal.component';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-order-request-modal-import',
  templateUrl: './order-request-modal-import.component.html',
  styleUrls: ['./order-request-modal-import.component.css']
})
export class OrderRequestModalImportComponent implements OnInit {
  searchForm;
  errAfterSubmit = false;
  errMessage = [];

  search_requests = [];

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: '',
      state: 'all'
    });
  }

  searchRequest(searchParam) {
    if (this.searchForm.valid) {
      this.search_requests = [];
      this.orderRequestService.searchImportRequest(searchParam).subscribe(
        (data: any) => this.readResponse(data),
        (error: any) => this.readError(error)
      );
    } else {
      this.errMessage = [];
      for (var control in this.searchForm.controls) {
        if (this.searchForm.get(control).status === 'INVALID') {
          this.errMessage.push(this.ucFirst(control) + ' is required!');
        }
      };
      this.errAfterSubmit = true;
    }
  }

  showRequestDeatils(id) {
    const modalRef = this.modalService.open(OrderRequestDetailModalComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.request_id = id;
  }

  import(id) {
    if (confirm("Are you sure you want to import this request? This will override all fields!")) {
      this.search_requests.forEach(request => {
        if (request.ParcelOrderItemId = id) {
          this.activeModal.close(request);
        }
      });
    }
  }

  ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }

  readResponse(resp) {
    // console.log(resp);
    this.errMessage = [];
    this.search_requests = resp.results;
  }

  readError(err) {
    console.log(err);
    this.errMessage = err.error;
  }

}
