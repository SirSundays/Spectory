import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFileImportComponent } from './user-file-import.component';

describe('UserFileImportComponent', () => {
  let component: UserFileImportComponent;
  let fixture: ComponentFixture<UserFileImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFileImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFileImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
