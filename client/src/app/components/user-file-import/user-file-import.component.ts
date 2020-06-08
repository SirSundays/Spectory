import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user/user.service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-user-file-import',
  templateUrl: './user-file-import.component.html',
  styleUrls: ['./user-file-import.component.css']
})
export class UserFileImportComponent implements OnInit {
  errAfterSubmit = false;
  errMessage = [];

  users: any[] = [];
  header = true;
  allGroups = [];

  userForm;
  fileToUpload: File = null;

  @ViewChild('labelImport')
  labelImport: ElementRef;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private ngxCsvParser: NgxCsvParser) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      importCSVFile: [{ value: '', disabled: false }],
      groups: [{ value: '', disabled: false }]
    });
    this.userService.getAllGroups().subscribe(data => {
      this.allGroups = data["results"];
    });
  }

  loadData() {
    this.ngxCsvParser.parse(this.fileToUpload, { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {
        this.errAfterSubmit = false;
        this.errMessage = [];
        this.users = result;
        for (let i = 0; i < this.users.length; i++) {
          this.users[i].status = 'Job not started';
          this.users[i].groups = [];
        }
      }, (error: NgxCSVParserError) => {
        this.errAfterSubmit = true;
        this.errMessage.push(error.message);
      });
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

  createUsers() {
    if (this.users.length > 0) {
      if (confirm(`The server will try to create all the user in the list below. 
      On success an email will be automatically send to the new user. 
      If the user already exist he will be added to a group (if choosen). 
      Do you want to proceed? (When yes: Please do not close this page until all users are created (or have an error))`)) {
        for (let i = 0; i < this.users.length; i++) {
          this.users[i].status = 'Pending';
          this.users[i].groups[0] = this.userForm.value.groups;
        }
        for (let i = 0; i < this.users.length; i++) {
          this.users[i].status = 'Send to server';
          this.userService.postNewUser(this.users[i]).subscribe(data => {
            this.users[i].status = data['msg'];
          }, error => {
            switch(error.status) {
              case 400:
                // Bad Request
                this.errAfterSubmit = true;
                this.errMessage.push(error["message"]);
                this.users[i].status = 'Error';
                break;
              case 409:
                // Conflict
                this.users[i].status = error.error.err;
                break;
              default:
                // What de fu** is going on
                this.users[i].status = 'Very bad error';
                break;
            }
          });
        }
      }
    } else {
      alert("No user where loaded! Select a valid .csv!");
    }
  }

}
