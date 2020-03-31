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

exports.newRequest = async function(req, res) {
    try {
        /*
        const request = new Order_Request({
            name: req.body.name,
            quantity: req.body.quantity,
            price:  req.body.price,
            shipping: req.body.shipping,
            reason: req.body.reason,
            link: req.body.link,
            info: req.body.info,
            user: 
        });
        let data = await request.save();
        */
       console.log(req);
        res.status(201).json({  })
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}