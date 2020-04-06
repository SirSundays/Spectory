const mongoose = require("mongoose");

const orderRequestSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: [true, "Please Include name of your item"]
  },
  quantity: {
    type: Number,
    required: [true, "Please Include the quantity you need"]
  },
  price: {
    type: Number,
    required: [true, "Please Include how much everything costs together"]
  },
  shipping: {
    type: Number,
    required: [true, "Please Include the shipping cost in total"]
  },
  reason: {
    type: String,
    required: [true, "Please Include why you need this item"]
  },
  link: {
    type: String,
    required: [true, "Please Include where to buy this item"]
  },
  alt_link: {
    type: String
  },
  info: {
    type: String
  },
  user: {
    
  },
  created: {
    type: Number
  },
  state: {
    type: String
  },
  admin_user: {
    type: String
  },
  message: {
    type: String
  },
  processed: {
    type: Number
  }
});

const OrderRequest = mongoose.model("OrderRequest", orderRequestSchema);
module.exports = OrderRequest;