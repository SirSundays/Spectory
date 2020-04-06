const User = require('../model/User');

let adminClient = require('../../../_edited_node_modules/keycloak-admin-client');

let settings = {
    baseUrl: 'http://127.0.0.1:8000/auth',
    username: 'Spectory',
    password: 'admin123',
    grant_type: 'password',
    client_id: 'admin-cli'
};

exports.getFullName = async function (req, res) {
    try {
        adminClient(settings)
            .then((client) => {
                client.users.find('Spectory', { email: req.query.email }).then((user) => {
                    res.status(201).json({
                        firstname: user[0].firstName,
                        lastname: user[0].lastName
                    });
                });
            })
            .catch((err) => {
                res.status(400).json({ err: err })
            });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}

exports.searchAllBasicUser = async function (req, res) {
    try {
        adminClient(settings)
            .then((client) => {
                client.realms.roles.findUsersWithRole('Spectory', { name: 'basic' }).then((users) => {
                    let sendUser = [];
                    users.forEach(user => {
                        sendUser.push({
                            fullName: user.firstName + " " + user.lastName,
                            email: user.email
                        })
                    });
                    res.status(201).json({
                        sendUser
                    });
                });
            })
            .catch((err) => {
                res.status(400).json({ err: err })
            });
    }
    catch {
        res.status(400).json({ err: err })
    }
}

exports.searchAllPurchaserUser = async function (req, res) {
    try {
        adminClient(settings)
            .then((client) => {
                client.realms.roles.findUsersWithRole('Spectory', { name: 'purchaser' }).then((users) => {
                    let sendUser = [];
                    users.forEach(user => {
                        sendUser.push({
                            fullName: user.firstName + " " + user.lastName,
                            email: user.email
                        })
                    });
                    res.status(201).json({
                        sendUser
                    });
                });
            })
            .catch((err) => {
                res.status(400).json({ err: err })
            });
    }
    catch {
        res.status(400).json({ err: err })
    }
}