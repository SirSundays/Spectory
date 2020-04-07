const ParcelTracking = require("../model/ParcelTracking");
const Order_Request = require('../../order_request/model/Order_request');
const userController = require('../../user/controller/userController');

exports.getAll = async function (req, res) {
    try {
        const all = await ParcelTracking.find().sort({ created: -1 }).populate('orderRequest');
        all.forEach(async function (parcel, i, parcel_out) {
            parcel_out[i] = {};
            parcel_out[i] = parcel;
            parcel_out[i].finished = false;
            if (parcel.orderRequest != undefined) {
                // for allocated request
                parcel_out[i].name = parcel.orderRequest.name;
                parcel_out[i].quantity = parcel.orderRequest.quantity;
                parcel_out[i].price = parcel.orderRequest.price;
                parcel_out[i].shipping = parcel.orderRequest.shipping;
                parcel_out[i].link = parcel.orderRequest.link;
                parcel_out[i].receiver = parcel.orderRequest.user;
                delete parcel_out[i].orderRequest;
            } else {
                // for parceltrack only
            }
            userController.idToUser(parcel.receiver, function (user) {
                parcel_out[i].receiver = user;
                userController.idToUser(parcel.purchaser, function (user) {
                    parcel_out[i].purchaser = user;
                    parcel_out[i].finished = true;
                    allFinished = true;
                    parcel_out.forEach(parcel => {
                        if (!parcel.finished) {
                            allFinished = false;
                        }
                    });
                    if (parcel_out.length === all.length && allFinished) {
                        res.status(201).json({ parcel_out });
                    }
                });
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: err });
    }
}

exports.getSearch = async function (req, res) {
    try {
        let name = req.query.name;
        let mine = req.query.mine;
        let sort = req.query.sort;

        if(mine === 'true') {
            let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
            userController.emailToId(email, async function (id) {
                let parcel_out = await ParcelTracking.find({name: { $regex: name, $options: 'i' }, mine: id}).populate('orderRequest');
                res.status(201).json({ parcel_out });
            });
        } else {
            let parcel_out = await ParcelTracking.find({name: { $regex: name, $options: 'i' }}).populate('orderRequest');
            res.status(201).json({ parcel_out });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: err });
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        const one = await ParcelTracking.findOne({ _id: req.query.parcel_id }).populate('orderRequest');
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
        userController.idToUser(one.receiver, function (user) {
            one.receiver = user;
            userController.idToUser(one.purchaser, function (user) {
                one.purchaser = user;
                userController.idToUser(one.allocater, function (user) {
                    one.allocater = user;
                    res.status(201).json({ one });
                });
            });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.newRequestAllocate = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            const request = new ParcelTracking({
                orderRequest: req.body.orderRequest,
                purchaser: req.body.purchaser,
                created: Date.now(),
                state: 'allocated',
                allocater: id,
            });
            let updateRequest = await Order_Request.findByIdAndUpdate(req.body.orderRequest, {
                state: 'allocated',
            }, {
                new: true
            });
            let data = await request.save();
            res.status(201).json({ data });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.newParcel = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            const parcel = new ParcelTracking({
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                shipping: req.body.shipping,
                link: req.body.link,
                created: Date.now(),
                allocater: id,
                state: 'allocated',
                purchaser: req.body.purchaser,
                receiver: req.body.receiver
            });
            let data = await parcel.save();
            res.status(201).json({ data });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcelOrdered = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            let parcel = await ParcelTracking.findByIdAndUpdate(req.body.id, {
                state: 'ordered',
                ordered: Date.now()
            }, {
                new: true
            });
            if (parcel.orderRequest != undefined) {
                let update = await Order_Request.findByIdAndUpdate(parcel.orderRequest, {
                    state: 'ordered'
                }, {
                    new: true
                });
            }
            res.status(201).json({ parcel });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcelDelivered = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            let parcel = await ParcelTracking.findByIdAndUpdate(req.body.id, {
                state: 'archived',
                ordered: Date.now()
            }, {
                new: true
            });
            if (parcel.orderRequest != undefined) {
                let update = await Order_Request.findByIdAndUpdate(parcel.orderRequest, {
                    state: 'archived'
                }, {
                    new: true
                });
            }
            res.status(201).json({ parcel });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcelTracking = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            let parcel = await ParcelTracking.findByIdAndUpdate(req.body.id, {
                trackingNumber: req.body.trackingnumber,
            }, {
                new: true
            });
            res.status(201).json({ parcel });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcelExpectedDelivery = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            let parcel = await ParcelTracking.findByIdAndUpdate(req.body.id, {
                expectedDelivery: req.body.expectedDelivery,
            }, {
                new: true
            });
            res.status(201).json({ parcel });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.updateParcelInvoice = async function (req, res) {
    
}