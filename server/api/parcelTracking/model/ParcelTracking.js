const mongoose = require("mongoose");

const parcelTrackingSchema = mongoose.Schema({
  name: {
    type: String
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  shipping: {
    type: Number
  },
  link: {
    type: String
  },
  purchaser: {

  },
  created: {
    type: Number
  },
  state: {
    type: String
  },
  expectedDelivery: {
    type: Number
  },
  ordered: {
    type: Number
  },
  receiver: {

  },
  orderRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderRequest'
  },
  trackingNumber: {
    type: String
  },
  allocater: {

  }
});

const ParcelTracking = mongoose.model("ParcelTracking", parcelTrackingSchema);
module.exports = ParcelTracking;