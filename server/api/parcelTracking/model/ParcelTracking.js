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
    type: String
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
      type: String
  },
  orderRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderRequest'
  },
  trackingNumber: {
    type: String
  },
  allocater: {
    type: String
  }
});

parcelTrackingSchema.statics.getAll = async function () {
  try {
    let parcel_out = [];
    const all = await ParcelTracking.find().sort({created: -1}).populate('orderRequest');
    all.forEach(parcel => {
      if (parcel.orderRequest != undefined) {
        // for allocated request
        parcel.name = parcel.orderRequest.name;
        parcel.quantity = parcel.orderRequest.quantity;
        parcel.price = parcel.orderRequest.price;
        parcel.shipping = parcel.orderRequest.shipping;
        parcel.link = parcel.orderRequest.link;
        parcel.receiver = parcel.orderRequest.user;
        delete parcel.orderRequest;
        parcel_out.push(parcel);
      } else {
        // for parceltrack only
        parcel_out.push(parcel);
      }
    });
    return parcel_out;
  }
  catch (err) {
    return err;
  }
}

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