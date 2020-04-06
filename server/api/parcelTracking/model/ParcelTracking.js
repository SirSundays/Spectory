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
    type: String
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

parcelTrackingSchema.statics.getOneSpecific = async function (req_id) {
  try {
    const one = await ParcelTracking.findOne({ _id: req_id }).populate('orderRequest');
    if (one.orderRequest != undefined) {
      // for allocated request
      one.name = one.orderRequest.name;
      one.quantity = one.orderRequest.quantity;
      one.price = one.orderRequest.price;
      one.shipping = one.orderRequest.shipping;
      one.link = one.orderRequest.link;
      one.receiver = one.orderRequest.user;
      delete one.orderRequest;
    } else {
      // for parceltrack only
    }
    return one;
  }
  catch (err) {
    return err;
  }
}

const ParcelTracking = mongoose.model("ParcelTracking", parcelTrackingSchema);
module.exports = ParcelTracking;