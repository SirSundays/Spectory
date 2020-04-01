'use strict';

const User = require('../model/User');
const axios = require('axios');
const keycloak_url = 'localhost:8000/auth/Spectory'
let adminClient = require('./');

let settings = {
    baseUrl: 'http://127.0.0.1:8000/auth',
    username: 'Spectory',
    password: 'admin123',
    grant_type: 'password',
    client_id: 'Spectory-Server'
};

exports.getFullName = async function (req, res) {
    try {
        /*
        await axios({
            method: 'get',
            url: keycloak_url + '/users',
            data: {
                email: req.query.email
            }
        }).then(function (response) {
            console.log(response);
            res.status(201).json({ response });
        });
        */
        adminClient(settings)
            .then((client) => {
                console.log('client', client);
                client.realms.find()
                    .then((realms) => {
                        console.log('realms', realms);
                    });
            })
            .catch((err) => {
                console.log('Error', err);
            });
    }
    catch (err) {
        res.status(400).json({ err: err })
    }
}