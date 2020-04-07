import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParcelTrackingService {

  constructor(private http: HttpClient) { }

  node_url = 'http://localhost:4000';

  getAllParcels() {
    return this.http.get(this.node_url + '/api/parcelTracking/all');
  }

  getAllParcelsSearch(search) {
    let param = new HttpParams()
    .set('name', search.name)
    .set('mine', search.mine)
    .set('sort', search.sort);
    return this.http.get(this.node_url + '/api/parcelTracking/all/search', { params: param });
  }

  getOneSpecificParcel(id) {
    let param = new HttpParams()
    .set('parcel_id', id);
    return this.http.get(this.node_url + '/api/parcelTracking/OneSpecific', { params: param });
  }

  allocateRequest(request) {
    return this.http.post(this.node_url + '/api/parcelTracking/new_request_allocate', request);
  }

  updateParcelOrdered(id) {
    let body = {
      id: id
    }
    return this.http.put(this.node_url + '/api/parcelTracking/parcel_ordered', body);
  }

  updateParcelDelivered(id) {
    let body = {
      id: id
    }
    return this.http.put(this.node_url + '/api/parcelTracking/parcel_delivered', body);
  }

  addInvoice() {

  }

  addTracking(id, trackingnumber) {
    let body = {
      id: id,
      trackingnumber: trackingnumber
    }
    return this.http.put(this.node_url + '/api/parcelTracking/parcel_tracking', body);
  }

  addDelivery(id, expectedDelivery) {
    let body = {
      id: id,
      expectedDelivery: expectedDelivery
    }
    return this.http.put(this.node_url + '/api/parcelTracking/parcel_delivery', body);
  }

  postNewParcel(newParcel) {
    return this.http.post(this.node_url + '/api/parcelTracking/new_parcel', newParcel);
  }
}
