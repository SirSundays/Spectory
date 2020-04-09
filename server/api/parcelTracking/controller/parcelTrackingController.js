const userController = require('../../user/controller/userController');

exports.getAll = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT poi.*, pt.*, 
        purchaser.FIRST_NAME AS purchaserFirstName, purchaser.LAST_NAME AS purchaserLastName, purchaser.EMAIL  AS purchaserEmail,
        allocater.FIRST_NAME AS allocaterFirstName, allocater.LAST_NAME AS allocaterLastName, allocater.EMAIL  AS allocaterEmail,
        receiver.FIRST_NAME AS receiverFirstName, receiver.LAST_NAME AS receiverLastName, receiver.EMAIL  AS receiverEmail
        FROM parcelorderitem poi, parceltracking pt 
        JOIN user_entity AS purchaser
            ON purchaser.ID = pt.purchaserId
        JOIN user_entity AS allocater
            ON allocater.ID = pt.allocaterId
        JOIN user_entity AS receiver
            ON receiver.ID = pt.receiverId
        WHERE poi.ParcelOrderItemId = pt.ParcelOrderItemId
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
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.getSearch = async function (req, res) {
    try {
        let name = req.query.name;
        let mine = req.query.mine;
        let sort = req.query.sort;

        if (mine === 'true') {
            let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
            userController.emailToId(email, async function (id) {
                spectoryDb.execute(`
                SELECT poi.*, pt.*, 
                purchaser.FIRST_NAME AS purchaserFirstName, purchaser.LAST_NAME AS purchaserLastName, purchaser.EMAIL  AS purchaserEmail,
                allocater.FIRST_NAME AS allocaterFirstName, allocater.LAST_NAME AS allocaterLastName, allocater.EMAIL  AS allocaterEmail,
                receiver.FIRST_NAME AS receiverFirstName, receiver.LAST_NAME AS receiverLastName, receiver.EMAIL  AS receiverEmail
                FROM parcelorderitem poi, parceltracking pt 
                JOIN user_entity AS purchaser
                    ON purchaser.ID = pt.purchaserId
                JOIN user_entity AS allocater
                    ON allocater.ID = pt.allocaterId
                JOIN user_entity AS receiver
                    ON receiver.ID = pt.receiverId
                WHERE poi.ParcelOrderItemId = pt.ParcelOrderItemId AND
                (purchaser.ID = ? OR allocater.ID = ? OR receiver.ID = ?) AND
                poi.name LIKE "%${name}%"
                ORDER BY poi.${sort}
                `, [id, id, id], (err, results) => {
                    if (err) {
                        res.status(400).json({ err });
                    } else {
                        res.status(201).json({ results });
                    }
                });
            });
        } else {
            spectoryDb.execute(`
                SELECT poi.*, pt.*, 
                purchaser.FIRST_NAME AS purchaserFirstName, purchaser.LAST_NAME AS purchaserLastName, purchaser.EMAIL  AS purchaserEmail,
                allocater.FIRST_NAME AS allocaterFirstName, allocater.LAST_NAME AS allocaterLastName, allocater.EMAIL  AS allocaterEmail,
                receiver.FIRST_NAME AS receiverFirstName, receiver.LAST_NAME AS receiverLastName, receiver.EMAIL  AS receiverEmail
                FROM parcelorderitem poi, parceltracking pt 
                JOIN user_entity AS purchaser
                    ON purchaser.ID = pt.purchaserId
                JOIN user_entity AS allocater
                    ON allocater.ID = pt.allocaterId
                JOIN user_entity AS receiver
                    ON receiver.ID = pt.receiverId
                WHERE poi.ParcelOrderItemId = pt.ParcelOrderItemId AND
                poi.name LIKE "%${name}%"
                ORDER BY poi.${sort}
                `, [], (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json({ results });
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.getOneSpecific = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT poi.*, pt.*, 
        purchaser.FIRST_NAME AS purchaserFirstName, purchaser.LAST_NAME AS purchaserLastName, purchaser.EMAIL  AS purchaserEmail,
        allocater.FIRST_NAME AS allocaterFirstName, allocater.LAST_NAME AS allocaterLastName, allocater.EMAIL  AS allocaterEmail,
        receiver.FIRST_NAME AS receiverFirstName, receiver.LAST_NAME AS receiverLastName, receiver.EMAIL  AS receiverEmail
        FROM parcelorderitem poi, parceltracking pt 
        JOIN user_entity AS purchaser
            ON purchaser.ID = pt.purchaserId
        JOIN user_entity AS allocater
            ON allocater.ID = pt.allocaterId
        JOIN user_entity AS receiver
            ON receiver.ID = pt.receiverId
        WHERE poi.ParcelOrderItemId = pt.ParcelOrderItemId AND poi.ParcelOrderItemId = ?
        `, [req.query.parcel_id], (err, results) => {
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
        res.status(400).json({ err });
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
        res.status(400).json({ err });
    }
}

exports.newParcel = async function (req, res) {
    try {
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        spectoryDb.execute(
            'INSERT INTO `parcelorderitem`(`name`, `quantity`, `price`, `shipping`, `link`, `state`, `created`) VALUES (?,?,?,?,?,?,?)',
            [req.body.name, req.body.quantity, req.body.price, req.body.shipping, req.body.link, 'allocated', Date.now()],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    let newParcelOrderItemId = results.insertId;
                    userController.emailToId(email, async function (id) {
                        spectoryDb.execute(
                            'INSERT INTO `parceltracking`(`purchaserId`, `allocaterId`, `receiverId`, `ParcelOrderItemId`) VALUES (?,?,?,?)',
                            [req.body.purchaser, id, req.body.receiver, newParcelOrderItemId],
                            (err, results) => {
                                if (err) {
                                    res.status(400).json({ err });
                                }
                                res.status(201).json('success');
                            }
                        );
                    });
                }
            }
        );
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateParcelOrdered = async function (req, res) {
    try {
        // further validation could be added eg did the purchaser send this request
        spectoryDb.execute("UPDATE parcelorderitem SET state='ordered' WHERE ParcelOrderItemId = ?",
            [req.body.id],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    spectoryDb.execute("UPDATE parceltracking SET ordered=? WHERE ParcelOrderItemId = ?",
                        [Date.now(), req.body.id],
                        (err, results) => {
                            if (err) {
                                res.status(400).json({ err });
                            }
                            res.status(201).json('success');
                        });
                }
            });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.updateParcelDelivered = async function (req, res) {
    try {
        // further validation could be added eg did the receiver send this request
        spectoryDb.execute("UPDATE parcelorderitem SET state='archived' WHERE ParcelOrderItemId = ?",
            [req.body.id],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json('success');
                }
            });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateParcelTracking = async function (req, res) {
    try {
        // further validation could be added eg did the purchaser send this request
        spectoryDb.execute("UPDATE parceltracking SET trackingNumber=? WHERE ParcelOrderItemId = ?",
            [req.body.trackingnumber, req.body.id],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json('success');
                }
            });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateParcelExpectedDelivery = async function (req, res) {
    try {
        // further validation could be added eg did the purchaser send this request
        spectoryDb.execute("UPDATE parceltracking SET expectedDelivery=? WHERE ParcelOrderItemId = ?",
            [req.body.expectedDelivery, req.body.id],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json('success');
                }
            });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.updateParcelInvoice = async function (req, res) {

}