const ParcelTracking = require("../model/ParcelTracking");
const Order_Request = require('../../order_request/model/Order_request');

exports.getAll = async function (req, res) {
    try {
        const all = await ParcelTracking.getAll();
        res.status(201).json({ all });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        const one = await ParcelTracking.getOneSpecific(req.query.parcel_id);
        res.status(201).json({ one });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.newRequestAllocate = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        const request = new ParcelTracking({
            orderRequest: req.body.orderRequest,
            purchaser: req.body.purchaser,
            created: Date.now(),
            state: 'allocated',
            allocater: email,
        });
        let updateRequest = await Order_Request.findByIdAndUpdate(req.body.orderRequest, {
            state: 'allocated',
        }, {
            new: true
        });
        let data = await request.save();
        res.status(201).json({ data });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.newParcel = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        const parcel = new ParcelTracking({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            shipping: req.body.shipping,
            link: req.body.link,
            created: Date.now(),
            allocater: email,
            state: 'allocated',
            purchaser: req.body.purchaser,
            receiver: req.body.receiver
        });
        let data = await parcel.save();
        res.status(201).json({ data });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcel = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        let update = await Order_Request.findByIdAndUpdate(req.body.id, {
            state: req.body.state,
            message: req.body.message,
            admin_user: email,
            processed: Date.now()
        }, {
            new: true
        });
        res.status(201).json({ update });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}