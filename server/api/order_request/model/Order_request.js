const mongoose = require("mongoose");

const orderRequestSchema = mongoose.Schema({
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
      type: String
  },
  created: {
      type: Number
  }
});

orderRequestSchema.statics.getAll = async function() {
    try {
    const all = await OrderRequest.find();
    return all;
    }
    catch (err) {
        return err;
    }
}

const OrderRequest = mongoose.model("OrderRequest", orderRequestSchema);
module.exports = OrderRequest;