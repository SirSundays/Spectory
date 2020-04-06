import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParcelTrackingService {

  constructor(private http: HttpClient) { }

  node_url = 'http://localhost:4000';

  getAllParcels() {
    return this.http.get(this.node_url + '/api/parcelTracking/all')
  }

  getOneSpecificParcel(id) {
    let param = new HttpParams()
    .set('parcel_id', id);
    return this.http.get(this.node_url + '/api/parcelTracking/OneSpecific', { params: param });
  }

  allocateRequest(request) {
    return this.http.post(this.node_url + '/api/parcelTracking/new_request_allocate', request);
  }

  postNewParcel(newParcel) {
    return this.http.post(this.node_url + '/api/parcelTracking/new_parcel', newParcel);
  }
}
