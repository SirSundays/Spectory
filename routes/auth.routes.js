const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});

router.post('/signup', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(?);`, [db.escape(req.body.email)],
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This e-mail is already in use! Maybe reset your password.'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              db.query(
                `INSERT INTO users (username, password, registered, email) VALUES (?, ?, ?, ?)`, 
                [db.escape(req.body.username), hash, Date.now(), db.escape(req.body.email)],
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
      }
    );
});

router.post('/login', (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE email = ?;`, [db.escape(req.body.email)],
      (err, result) => {
        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err
          });
        }
        if (!result.length) {
          return res.status(401).send({
            msg: 'Email or password is incorrect!1'
          });
        }
        // check password
        bcrypt.compare(
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr;
              return res.status(401).send({
                msg: 'Email or password is incorrect!2'
              });
            }
            if (bResult) {
              const token = jwt.sign({
                  username: result[0].username,
                  userId: result[0].id,
                  role: result[0].role
                },
                'Spectory', {
                  expiresIn: '1h'
                }
              );
              db.query(`UPDATE users SET last_login = ? WHERE id = ?`, [Date.now(), result[0].id]);
              return res.status(200).send({
                msg: 'Logged in!',
                token
              });
            }
            return res.status(401).send({
              msg: 'Email or password is incorrect!3'
            });
          }
        );
      }
    );
});

module.exports = router;