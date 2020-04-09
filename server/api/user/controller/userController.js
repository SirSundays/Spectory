const userController = require('../controller/userController');

let adminClient = require('../../../_edited_node_modules/keycloak-admin-client');

let settings = {
    baseUrl: 'http://127.0.0.1:8000/auth',
    username: 'Spectory',
    password: 'admin123',
    grant_type: 'password',
    client_id: 'admin-cli'
};

exports.searchAllBasicUser = async function (req, res) {
    // very slow
    try {
        adminClient(settings)
            .then((client) => {
                client.realms.roles.findUsersWithRole('Spectory', { name: 'basic' }).then((users) => {
                    let sendUser = [];
                    users.forEach(user => {
                        sendUser.push({
                            fullName: user.firstName + " " + user.lastName,
                            email: user.email,
                            id: user.id
                        })
                    });
                    res.status(201).json({
                        sendUser
                    });
                });
            })
            .catch((err) => {
                res.status(400).json({ err: err });
            });
    }
    catch (err) {
        res.status(400).json({ err: err });
    }
}

exports.searchAllPurchaserUser = async function (req, res) {
    // very slow
    try {
        adminClient(settings)
            .then((client) => {
                client.realms.roles.findUsersWithRole('Spectory', { name: 'purchaser' }).then((users) => {
                    let sendUser = [];
                    users.forEach(user => {
                        sendUser.push({
                            fullName: user.firstName + " " + user.lastName,
                            email: user.email,
                            id: user.id
                        })
                    });
                    res.status(201).json({
                        sendUser
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ err: err })
            });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: err })
    }
}

exports.emailToId = async function (email, further) {
    // very slow
    try {
        adminClient(settings)
            .then((client) => {
                client.users.find('Spectory', { email: email }).then((users) => {
                    let id = users[0].id;
                    further(id);
                });
            })
            .catch((err) => {
                console.log(err);
                return -1;
            });
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

exports.idToUser = async function (id, further) {
    
    try {
        adminClient(settings)
            .then((client) => {
                client.users.find('Spectory', { userId: id }).then((users) => {
                    let user = {
                        id: id,
                        firstName: users.firstName,
                        lastName: users.lastName,
                        email: users.email
                    }
                    further(user);
                });
            })
            .catch((err) => {
                console.log(err);
                return -1;
            });
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}