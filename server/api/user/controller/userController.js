const User = require('../model/User');

let adminClient = require('keycloak-admin-client');

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
                client.users.find('Spectory', {email: req.query.email}).then((user) => {
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