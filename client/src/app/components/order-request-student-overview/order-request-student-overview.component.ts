import { Component, OnInit } from '@angular/core';
import { OrderRequestService } from 'src/app/service/order-request/order-request.service';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderRequestStudentQuickCreateComponent } from '../order-request-student-quick-create/order-request-student-quick-create.component';

@Component({
  selector: 'app-order-request-student-overview',
  templateUrl: './order-request-student-overview.component.html',
  styleUrls: ['./order-request-student-overview.component.css']
})
export class OrderRequestStudentOverviewComponent implements OnInit {

  constructor(private orderRequestService: OrderRequestService, private formBuilder: FormBuilder, private userService: UserService, private modalService: NgbModal, private route: ActivatedRoute, public router: Router, public activeModal: NgbActiveModal) { }

  all_templates = [];

  roles = [];

  ngOnInit(): void {
    this.orderRequestService.getAllStudentRequestTemplates().subscribe(data => {
      this.all_templates = data['results'];
    });
    this.roles = this.userService.getUserRoles();
  }

  async addTemplate() {
    const modalRef = this.modalService.open(OrderRequestStudentQuickCreateComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    try {
      modalRef.close = await modalRef.result;
      this.orderRequestService.getAllStudentRequestTemplates().subscribe(data => {
        this.all_templates = data['results'];
      });
    } catch {

    }
  }

  async editTemplate(id) {
    const modalRef = this.modalService.open(OrderRequestStudentQuickCreateComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.edit_id = id;
    try {
      modalRef.close = await modalRef.result;
      this.orderRequestService.getAllStudentRequestTemplates().subscribe(data => {
        this.all_templates = data['results'];
      });
    } catch {

    }
  }

  deleteTemplate(id, name) {
    if (confirm("Do you really want to delete " + name + "?")) {
      this.orderRequestService.deleteRequestTemplate(id).subscribe(
        (data: any) => {
          alert("Successfully delete the template  " + name + "!");
          try {
            this.orderRequestService.getAllStudentRequestTemplates().subscribe(data => {
              this.all_templates = data['results'];
            });
          } catch {

          }
        },
        (err: any) => alert("Error: " + err)
      );
    }
  }
}
