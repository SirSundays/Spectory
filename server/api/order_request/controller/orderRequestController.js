const userController = require('../../user/controller/userController');
const mailController = require('../../email/emailController/emailController');

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

exports.getSearch = async function (req, res) {
    try {
        let query = `SELECT poi.*, orq.*, 
        requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
        FROM parcelorderitem poi, orderrequest orq 
        JOIN user_entity AS requester
            ON requester.ID = orq.requesterId
        WHERE poi.ParcelOrderItemId = orq.ParcelOrderItemId
        `

        let name = req.query.name;
        let mine = req.query.mine;
        let sort = req.query.sort;
        let state = req.query.state;
        let priceMin = req.query.priceMin;
        let priceMax = req.query.priceMax;
        let source = req.query.source;

        if (mine === 'true') {
            query += ' AND (requester.ID = ?)';
        }

        if (state != 'all') {
            query += ` AND poi.state = '${state}'`;
        }

        if (priceMin != '' && priceMin != 'null') {
            query += ` AND poi.price > ${priceMin}`;
        }

        if (priceMax != '' && priceMax != 'null') {
            query += ` AND poi.price < ${priceMax}`;
        }

        query += ` AND poi.link LIKE "%${source}%"`;
        query += ` AND poi.name LIKE "%${name}%"`;
        query += ` ORDER BY poi.${sort}`;

        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        userController.emailToId(email, async function (id) {
            spectoryDb.execute(query
                , [id], (err, results) => {
                    if (err) {
                        res.status(400).json({ err });
                    } else {
                        res.status(201).json({ results });
                    }
                });
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
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
        let email = jwt.decode(req.headers.authorization.split(' ')[1]).email;
        await userController.emailToId(email, async function (id) {
            spectoryDb.execute('UPDATE orderrequest SET message=?,processed=?, adminUserId=? WHERE ParcelOrderItemId=?',
                [req.body.message, Date.now(), id, req.body.parcelOrderItemId],
                (err, results) => {
                    if (err) {
                        res.status(400).json({ err });
                    } else {
                        spectoryDb.execute('UPDATE parcelorderitem SET state=? WHERE ParcelOrderItemId=?',
                            [req.body.state, req.body.parcelOrderItemId],
                            (err, results) => {
                                if (err) {
                                    res.status(400).json({ err });
                                } else {
                                    mailController.orderRequestProcessMail(req.body.parcelOrderItemId);
                                    res.status(201).json('success');
                                }
                            });
                    }
                });
        });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.newStudentRequestTemplate = async function (req, res) {
    try {
        spectoryDb.execute('SELECT * FROM parcelorderitem WHERE ParcelOrderItemId = ?',
            [req.body.id],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    results = results[0];
                    spectoryDb.execute('INSERT INTO orderrequeststudents(name, quantity, price, shipping, link) VALUES (?,?,?,?,?)',
                        [results.name, results.quantity, results.price, results.shipping, results.link],
                        (err, results) => {
                            if (err) {
                                res.status(400).json({ err });
                            } else {
                                spectoryDb.execute('UPDATE parcelorderitem SET hasTemplate=1 WHERE ParcelOrderItemId = ?',
                                    [req.body.id],
                                    (err, results) => {
                                        if (err) {
                                            res.status(400).json({ err });
                                        } else {
                                            res.status(201).json('success');
                                        }
                                    });
                            }
                        })
                }
            });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.newStudentRequestTemplateScratch = async function (req, res) {
    try {
        let name = req.body.name;
        let quantity = req.body.quantity;
        let price = req.body.price;
        let shipping = req.body.shipping;
        let link = req.body.link;

        spectoryDb.execute('INSERT INTO orderrequeststudents(name, quantity, price, shipping, link) VALUES (?,?,?,?,?)',
            [name, quantity, price, shipping, link],
            (err, results) => {
                if (err) {
                    res.status(400).json({ err });
                } else {
                    res.status(201).json('success');
                }
            })
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

exports.getAllStudentRequestTemplates = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT * FROM orderrequeststudents
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

exports.deleteStudentRequestTemplate = async function (req, res) {
    try {
        spectoryDb.execute(`
        DELETE FROM orderrequeststudents WHERE orderrequeststudents_id = ?
        `, [req.query.id], (err, results) => {
            if (err) {
                res.status(400).json({ err });
            } else {
                res.status(201).json('success');
            }
        }
        );
    }
    catch (err) {
        res.status(400).json({ err })
    }
}

exports.getOneSpecificTemplate = async function (req, res) {
    try {
        spectoryDb.execute(`
        SELECT * FROM orderrequeststudents WHERE orderrequeststudents_id = ?
        `, [req.query.template_id], (err, results) => {
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

exports.updateTemplate = async function (req, res) {
    try {
        let name = req.body.name;
        let quantity = req.body.quantity;
        let price = req.body.price;
        let shipping = req.body.shipping;
        let link = req.body.link;

        let id = req.body.orderrequeststudents_id;

        spectoryDb.execute(`
        UPDATE orderrequeststudents SET name=?,quantity=?,price=?,shipping=?,link=? WHERE orderrequeststudents_id = ?
        `, [name, quantity, price, shipping, link, id], (err, results) => {
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