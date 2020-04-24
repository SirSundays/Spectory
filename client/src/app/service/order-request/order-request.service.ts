import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderRequestService {

  constructor(private http: HttpClient) { }

  node_url = environment.nodejs_ip;

  getAllRequests() {
    return this.http.get(this.node_url + '/api/order_request/all');
  }

  getOneSpecificRequest(id) {
    let param = new HttpParams()
    .set('req_id', id);
    return this.http.get(this.node_url + '/api/order_request/OneSpecific', { params: param });
  }

  getAllRequestsSearch(search) {
    let param = new HttpParams()
    .set('name', search.name)
    .set('mine', search.mine)
    .set('sort', search.sort)
    .set('state', search.state)
    .set('priceMin', search.priceMin)
    .set('priceMax', search.priceMax)
    .set('source', search.source);
    return this.http.get(this.node_url + '/api/order_request/all/search', { params: param });
  }

  getAllStudentRequestTemplates() {
    return this.http.get(this.node_url + '/api/order_request/all/studentRequestTemplates');
  }

  getOneSpecificRequestTemplate(id) {
    let param = new HttpParams()
    .set('template_id', id);
    return this.http.get(this.node_url + '/api/order_request/OneSpecific/studentRequestTemplates', { params: param });
  }

  searchImportRequest(searchParam) {
    let param = new HttpParams()
    .set('name', searchParam.name)
    .set('state', searchParam.state);
    return this.http.get(this.node_url + '/api/order_request/importRequest', { params: param });
  }

  postNewRequest(newRequest) {
    return this.http.post(this.node_url + '/api/order_request/new_request', newRequest);
  }

  updateRequest(request) {
    return this.http.put(this.node_url + '/api/order_request/request', request);
  }

  postNewRequestTemplate(id) {
    return this.http.post(this.node_url + '/api/order_request/new_student_request', id);
  }

  postNewRequestTemplateScratch(template) {
    return this.http.post(this.node_url + '/api/order_request/new_student_request_scratch', template);
  }

  deleteRequestTemplate(id) {
    let param = new HttpParams()
    .set('id', id);
    return this.http.delete(this.node_url + '/api/order_request/student_request', { params: param });
  }

  updateTemplate(template) {
    return this.http.put(this.node_url + '/api/order_request/template', template);
  }
}
