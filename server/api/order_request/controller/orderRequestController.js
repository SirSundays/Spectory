const Order_Request = require('../model/Order_request');

exports.getAll = async function(req, res) {
    try {
        const all = await Order_Request.getAll();
        res.status(201).json({ all });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.getOneSpecific = async function(req, res) {
    try {
        const one = await Order_Request.getOneSpecific(req.query.req_id);
        res.status(201).json({ one });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.newRequest = async function(req, res) {
    try {
        var email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        const request = new Order_Request({
            name: req.body.name,
            quantity: req.body.quantity,
            price:  req.body.price,
            shipping: req.body.shipping,
            reason: req.body.reason,
            link: req.body.link,
            info: req.body.info,
            created: Date.now(),
            user: email,
            state: 'requested'
        });
        let data = await request.save();
        res.status(201).json({ data })
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}