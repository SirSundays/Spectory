const userController = require('../../user/controller/userController');

exports.getAll = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT poi.*, ore.*, 
        requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
        FROM parcelorderitem poi, orderrequest ore 
        JOIN user_entity AS requester
            ON requester.ID = ore.requesterId
        WHERE poi.ParcelOrderItemId = ore.ParcelOrderItemId
        ORDER BY poi.created DESC
        `, [], (err, results) => {
            if (err) {
                res.status(400).json({ err });
            } else {
                res.status(201).json({ results });
            }
        }
        );
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT poi.*, ore.*, 
        requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
        FROM parcelorderitem poi, orderrequest ore 
        JOIN user_entity AS requester
            ON requester.ID = ore.requesterId
        WHERE poi.ParcelOrderItemId = ore.ParcelOrderItemId AND poi.ParcelOrderItemId = ?
        `, [req.query.req_id], (err, results) => {
            if (err) {
                res.status(400).json({ err });
            } else {
                results = results[0];
                res.status(201).json({ results });
            }
        }
        );
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.searchImportRequest = async function (req, res) {
    try {
        let name = req.query.name;
        let state = req.query.state;

        if (req.query.state === 'all') {
            spectoryDb.execute(`
            SELECT poi.*, ore.*, 
            requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
            FROM parcelorderitem poi, orderrequest ore 
            JOIN user_entity AS requester
            ON requester.ID = ore.requesterId
            WHERE poi.ParcelOrderItemId = ore.ParcelOrderItemId AND
            poi.name LIKE "%${name}%"
            ORDER BY poi.created DESC
            LIMIT 20
            `, [], (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json({ results });
                }
            }
            );
        } else {
            spectoryDb.execute(`
            SELECT poi.*, ore.*, 
            requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
            FROM parcelorderitem poi, orderrequest ore 
            JOIN user_entity AS requester
            ON requester.ID = ore.requesterId
            WHERE poi.ParcelOrderItemId = ore.ParcelOrderItemId AND
            poi.name LIKE "%${name}%" AND
            poi.state = '${state}'
            ORDER BY poi.created DESC
            LIMIT 20
            `, [], (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json({ results });
                }
            }
            );
        }
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.newRequest = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        spectoryDb.execute('INSERT INTO parcelorderitem(`name`, `quantity`, `price`, `shipping`, `link`, `state`, `created`) VALUES (?,?,?,?,?,?,?)',
            [req.body.name, req.body.quantity, req.body.price, req.body.shipping, req.body.link, 'requested', Date.now()],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    let newParcelOrderItemId = results.insertId;
                    userController.emailToId(email, async function (id) {
                        spectoryDb.execute('INSERT INTO `orderrequest`(`reason`, `info`, `requesterId`, `ParcelOrderItemId`) VALUES (?,?,?,?)',
                            [req.body.reason, req.body.info, id, newParcelOrderItemId],
                            (err, results) => {
                                if (err) {
                                    res.status(400).json({ err });
                                } else {
                                    res.status(201).json('success');
                                }
                            });
                    });
                }
            });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.updateRequest = async function (req, res) {
    try {
        //ÄNDERN AUF SQL SOWIE NEWREQUESTALLOCATE
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
            console.log(update);
            res.status(201).json({ update });
        });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}