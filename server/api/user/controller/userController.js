const userController = require('../controller/userController');
const mailController = require('../../email/emailController/emailController');

let adminClient = require('../../../_edited_node_modules/keycloak-admin-client');

let settings = {
    baseUrl: keycloakAdminConfig.baseUrl,
    username: keycloakAdminConfig.username,
    password: keycloakAdminConfig.password,
    grant_type: keycloakAdminConfig.grant_type,
    client_id: keycloakAdminConfig.client_id
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
    // very slow
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

exports.getAllGroups = async function (req, res) {
    // direct db access for faster response times
    try {
        spectoryDb.execute(`
        SELECT * FROM keycloak_group
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

/**
 Generates a username out of the first and lastname
 firstname.lastname
 if it already exists:
 firstname.lastname0 ... firstname.lastname1 ....
*/
exports.generateUsername = async function (firstName, lastName, add, createUser) {
    let username = firstName + "." + lastName;
    if (add != 0) {
        username = firstName + "." + lastName + add;
    }

    adminClient(settings)
        .then(async (client) => {
            client.users.find('Spectory', {
                username: username
            })
                .then(async (userList) => {
                    if (userList.length != 0) {
                        return userController.generateUsername(firstName, lastName, add + 1, createUser);
                    } else {
                        createUser(username);
                    }
                })
        })
}

exports.newUser = async function (req, res) {
    try {
        let { email, firstname, surname, groups } = req.body;
        let lastname = surname //moodle file uses surname not lastname
        let enabled = true;
        let credentials = [
            {
                type: 'password',
                temporary: true,
                value: Math.random().toString(36).substring(2, 15)
            }
        ];
        if (groups.length === 1 && groups[0] === '') {
            groups = [];
        }
        adminClient(settings)
            .then((client) => {
                client.users.find('Spectory', {
                    email: email
                })
                    .then((userList) => {
                        if (userList.length == 0) {
                            adminClient(settings)
                                .then((client) => {
                                    userController.generateUsername(firstname.toLowerCase(), lastname.toLowerCase(), 0, (genUsername) => {
                                        client.users.create('Spectory', {
                                            email: email,
                                            enabled: enabled,
                                            firstName: firstname,
                                            lastName: lastname,
                                            username: genUsername,
                                            groups: groups,
                                            credentials: credentials
                                        }).then((createdUser) => {
                                            mailController.userNewUser({
                                                FirstName: firstname,
                                                LastName: lastname,
                                                UserName: genUsername,
                                                Password: credentials[0].value,
                                                email: email
                                            });
                                            res.status(201).json({
                                                msg: "User created"
                                            });
                                        });
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(400).json({ err: err })
                                });
                        } else {
                            adminClient(settings)
                                .then((client) => {
                                    client.users.find('Spectory', {
                                        email: email
                                    })
                                        .then((userList) => {
                                            let updateUserId = userList[0].id;
                                            spectoryDb.execute(`
                                                SELECT * FROM keycloak_group WHERE NAME = ? 
                                                `, [groups[0]], (err, results) => {
                                                if (err) {
                                                    res.status(400).json({ err });
                                                } else {
                                                    results = results[0];
                                                    adminClient(settings)
                                                        .then((client) => {
                                                            client.users.update_groups('Spectory', {
                                                                groupId: results.ID,
                                                                id: updateUserId
                                                            })
                                                                .then(() => {
                                                                    res.status(201).json({ msg: "User with E-Mail already exists. Updated groups." })
                                                                })
                                                        })
                                                }
                                            }
                                            );
                                        })
                                })
                        }
                    })
            })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: err })
    }
}