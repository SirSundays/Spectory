import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderRequestService {

  constructor(private http: HttpClient) { }

  node_url = 'http://localhost:4000';

  getAllRequests() {
    return this.http.get(this.node_url + '/api/order_request/all');
  }

  getOneSpecificRequest(id) {
    let param = new HttpParams()
    .set('req_id', id);
    return this.http.get(this.node_url + '/api/order_request/OneSpecific', { params: param });
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
}
