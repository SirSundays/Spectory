const Order_Request = require('../model/Order_request');
const userController = require('../../user/controller/userController');

exports.getAll = async function (req, res) {
    try {
        const all = await Order_Request.find().sort({ created: -1 });
        all.forEach(async function (request, i, sendall) {
            sendall[i] = {};
            sendall[i] = request;
            userController.idToUser(request.user, async function (user) {
                sendall[i].user = user;
                if (sendall.length === all.length) {
                    res.status(201).json({ sendall });
                }
            });
        });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        const one = await Order_Request.findOne({ _id: req.query.req_id });
        userController.idToUser(one.user, async function(user) {
            one.user = user;
            res.status(201).json({ one });
        });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.searchImportRequest = async function (req, res) {
    try {
        if (req.query.state === 'all') {
            const results = await Order_Request.find({ name: { $regex: req.query.name, $options: 'i' } })
                .limit(20);
            res.status(201).json({ results });
        } else {
            const results = await Order_Request.find({ name: { $regex: req.query.name, $options: 'i' }, state: req.query.state })
                .limit(20);
            res.status(201).json({ results });
        }
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.newRequest = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            const request = new Order_Request({
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                shipping: req.body.shipping,
                reason: req.body.reason,
                link: req.body.link,
                info: req.body.info,
                created: Date.now(),
                user: id,
                state: 'requested'
            });
            let data = await request.save();
            console.log(data);
            res.status(201).json({ data });
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: err });
    }
}

exports.updateRequest = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        await userController.emailToId(email, async function (id) {
            let update = await Order_Request.findByIdAndUpdate(req.body.id, {
                state: req.body.state,
                message: req.body.message,
                admin_user: id,
                processed: Date.now()
            }, {
                new: true
            });
            res.status(201).json({ update });
        });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}