const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');

// route for setting new password
router.post('/forgetpassword', (req, res) => {

    var { newpassword, confirmpassword, email } = req.body;
    let err = [];
    var sql = require('mssql');
    var config = {
        user: 'sa',
        password: 'abcd',
        database: 'auth',
        server: 'DESKTOP-VOMOOC8'
    }
    sql.close();
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        var q1 = "select TokenExpire from auth where Email = '" + email + "'";
        request.query(q1, function (err, response) {
            if (err) { res.send({ "message": "error has occured" }) }
            time = response.recordset[0].TokenExpire;
            var milliseconds = (new Date).getTime();
            parseInt(time, 10);
            parseInt(milliseconds, 10);
            var diff = milliseconds - time;
            if (diff < 1800000) {
                res.send({ "message": "Session Expired" });
            } else {
                updatePassword();
            }
        });
    })

    // function for update password
    function updatePassword() {
        if (!newpassword || !confirmpassword) {
            res.send({ "message": "fill all entries" });
        }
        else {
            if (newpassword != confirmpassword) {
                res.send({ "mesaage": "pasword not match" });
            }
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newpassword, salt, (err, hash) => {
                        if (err) throw err;
                        newpassword = hash;

                        var sql = require('mssql');
                        const pool = new sql.ConnectionPool({
                            user: 'sa',
                            password: 'abcd',
                            server: 'DESKTOP-VOMOOC8',
                            database: 'auth'
                        })

                        var conn = pool;
                        conn.connect().then(function (err) {
                            if (err) console.log(err);
                            var request = new sql.Request(conn);
                            var q1 = "update auth set password = '" + newpassword + "' where email = '" + email + "'";
                            request.query(q1, function (err, response) {
                                if (err) { res.send(err); }
                                res.send({ "mesaage": "password has been changed" });
                            });
                        })

                    });
                });
            }
        }
    }
});

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successMessage: res.send("done")
    })(req, res, next)
});

// route for sending mail on clicking forget password
router.post('/forget', (req, res) => {
    var { email } = req.body;
    var token;
    const user = {
        email: email
    }
    jwt.sign({ user }, 'secretkey', { expiresIn: '1d' }, (err, tokenToStore) => {
        token = tokenToStore;
        console.log(token);
    });
    var sql = require('mssql');
    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'abcd',
        server: 'DESKTOP-VOMOOC8',
        database: 'auth'
    });
    var conn = pool;
    conn.connect().then(function (err) {
        if (err) console.log(err);
        var request = new sql.Request(conn);
        var q1 = "select * from auth where Email = '" + email + "'";
        var milliseconds = (new Date).getTime();
        var tokenExpire = milliseconds.toString();
        var q2 = "update auth set ResetToken = '" + token + "', TokenExpire = '" + tokenExpire + "' where Email = '" + email + "'";
        request.query(q1, function (err, response) {
            console.log(response);
            console.log(response);
            if (err) { res.send(err); }
            if (response.rowsAffected == 0) { res.send({ "message": "no email exist" }); }
            request.query(q2, function (err, resp) {
                if (err) { res.send(err); }
                else {
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey('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');
                    const msg = {
                        to: email,
                        from: 'rishabhsinghalrishabh@gmail.com',
                        subject: 'password reset',
                        text: 'check',
                        html: `<a href="http://localhost:7000/Reset.html"><h2>Click here to Reset Password</h2></a>`
                    }
                    if (sgMail.send(msg)) { res.send({ "message": "mail send" }); }
                    else { res.send({ "message": "mail not send" }); }
                }
            });
        });
    })
})

// Route to sign-up the user
router.post('/signup', (req, res) => {

    var { email, password, role } = req.body;
    if (!email || !password || !role) {
        res.send({ "message": "fill all entries" })
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                var sql = require('mssql');
                var config = {
                    user: 'sa',
                    password: 'abcd',
                    database: 'auth',
                    server: 'DESKTOP-VOMOOC8'
                }

                sql.connect(config, function (err) {
                    if (err) console.log(err);
                    var request = new sql.Request();
                    var q1 = "insert into auth (Email, Password, Role) values('" + email + "','" + password + "','" + role + "')";
                    request.query(q1, function (err, response) {
                        if (err) { res.send({ "message": "error occured" }); }
                        else { res.send({ "message": "user is signed up" }); }
                    });
                });
            });
        });
    }
})

module.exports = router;

