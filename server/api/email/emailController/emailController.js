const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
const fs = require("fs");
const path = require('path');

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
});

exports.orderRequestProcessMail = async function (id) {
    try {
        var templateHtml = fs.readFileSync(path.join(process.cwd(), '/api/email/templates/orderRequestProcess.html'), 'utf8');
        var template = handlebars.compile(templateHtml);

        spectoryDb.execute(`
        SELECT poi.*, ore.*, 
        requester.FIRST_NAME AS requesterFirstName, requester.LAST_NAME AS requesterLastName, requester.EMAIL  AS requesterEmail
        FROM parcelorderitem poi, orderrequest ore 
        JOIN user_entity AS requester
            ON requester.ID = ore.requesterId
        WHERE poi.ParcelOrderItemId = ore.ParcelOrderItemId AND poi.ParcelOrderItemId = ?
        `, [id], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                results = results[0];
                if (results.state === 'decline') {
                    results.state = 'declined'
                } else {
                    results.state = 'accepted'
                }
                var html = template({ "request": results });

                let mailOptions = {
                    from: 'Spectory',
                    to: results.requesterEmail,
                    subject: 'Your Orderrequest got processed',
                    html: html,
                    attachments: [{
                        filename: 'spectory.png',
                        path: path.join(process.cwd(), '/api/email/assets/spectory.png'),
                        cid: 'spectoryLogo'
                    }]
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
        );
    }
    catch (err) {
        console.log(err);
    }
}

exports.orderRequestAllocate = async function (id) {
    try {
        var templateHtmlReceiver = fs.readFileSync(path.join(process.cwd(), '/api/email/templates/orderRequestAllocateReceiver.html'), 'utf8');
        var templateReceiver = handlebars.compile(templateHtmlReceiver);

        var templateHtmlPurchaser = fs.readFileSync(path.join(process.cwd(), '/api/email/templates/orderRequestAllocatePurchaser.html'), 'utf8');
        var templatePurchaser = handlebars.compile(templateHtmlPurchaser);

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
        `, [id], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                results = results[0];

                var htmlReciver = templateReceiver({ "request": results });

                let mailOptionsReceiver = {
                    from: 'Spectory',
                    to: results.receiverEmail,
                    subject: 'Your Orderrequest got allocated',
                    html: htmlReciver,
                    attachments: [{
                        filename: 'spectory.png',
                        path: path.join(process.cwd(), '/api/email/assets/spectory.png'),
                        cid: 'spectoryLogo'
                    }]
                };

                transporter.sendMail(mailOptionsReceiver, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                var htmlPurchaser = templatePurchaser({ "request": results });

                let mailOptionsPurchaser = {
                    from: 'Spectory',
                    to: results.purchaserEmail,
                    subject: 'An Orderrequest got allocated to you',
                    html: htmlPurchaser,
                    attachments: [{
                        filename: 'spectory.png',
                        path: path.join(process.cwd(), '/api/email/assets/spectory.png'),
                        cid: 'spectoryLogo'
                    }]
                };

                transporter.sendMail(mailOptionsPurchaser, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
        );
    }
    catch (err) {
        console.log(err);
    }
}

exports.parcelTrackingOrdered = async function(id) {
    try {
        var templateHtmlReceiver = fs.readFileSync(path.join(process.cwd(), '/api/email/templates/parcelTrackingOrdered.html'), 'utf8');
        var templateReceiver = handlebars.compile(templateHtmlReceiver);

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
        `, [id], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                results = results[0];

                var htmlReciver = templateReceiver({ "request": results });

                let mailOptionsReceiver = {
                    from: 'Spectory',
                    to: results.receiverEmail,
                    subject: 'Your Orderrequest got ordered',
                    html: htmlReciver,
                    attachments: [{
                        filename: 'spectory.png',
                        path: path.join(process.cwd(), '/api/email/assets/spectory.png'),
                        cid: 'spectoryLogo'
                    }]
                };

                transporter.sendMail(mailOptionsReceiver, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
        );
    }
    catch (err) {
        console.log(err);
    }
}