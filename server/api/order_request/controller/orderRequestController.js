const OrderRequest = require('../model/OrderRequest');

exports.getAll = async function (req, res) {
    try {
        const all = await OrderRequest.getAll();
        res.status(201).json({ all });
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        const one = await OrderRequest.getOneSpecific(req.query.req_id);
        res.status(201).json({ one });
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.searchImportRequest = async function (req, res) {
    try {
        if (req.query.state === 'all') {
            const results = await OrderRequest.find({ name: { $regex: req.query.name, $options: 'i' } })
                .limit(20);
            res.status(201).json({ results });
        } else {
            const results = await OrderRequest.find({ name: { $regex: req.query.name, $options: 'i' }, state: req.query.state })
                .limit(20);
            res.status(201).json({ results });
        }
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.newRequest = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        const request = new OrderRequest({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            shipping: req.body.shipping,
            reason: req.body.reason,
            link: req.body.link,
            info: req.body.info,
            created: Date.now(),
            user: email,
            state: 'requested'
        });
        let data = await request.save();
        res.status(201).json({ data });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateRequest = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        let update = await OrderRequest.findByIdAndUpdate(req.body.id, {
            state: req.body.state,
            message: req.body.message,
            adminUser: email,
            processed: Date.now()
        }, {
            new: true
        });
        res.status(201).json({ update });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}