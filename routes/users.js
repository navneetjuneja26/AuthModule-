const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('config');

// route to handle login
router.post('/login', (req, res, next) => {
    var { email, password } = req.body;
    var sql = require('mssql');
    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'abcd',
        server: 'DESKTOP-VOMOOC8',
        database: 'auth'
    })
    var conn = pool;
    conn.connect().then(function (err) {
        var request = new sql.Request(conn);

        // query to get password and role for authenticate user
        var q1 = "select password,role from auth where email = '" + email + "'";
        request.query(q1, function (err, response) {
            if (err) { console.log(err); }
            if (response.rowsAffected == 0) { res.send({ "message": "no email found" }) }
            else {
                // geting password from response of executed query
                pass = response.recordset[0].password;

                // using bcrypt to compare hashed password and entered password
                bcrypt.compare(password, pass, (err, isMatch) => {
                    if (err) { console.log(err); }

                    if (isMatch) {

                        // generating data to store in token
                        const user = {
                            Role: response.recordset[0].role,
                            email: email
                        }

                        // generating token
                        jwt.sign({ user }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
                            var dataToSend = {
                                "message": "token generated successfully",
                                "token": token
                            }
                            res.send(dataToSend);           // sending token and messahe as a response
                        });
                    } else {
                        res.send({ "message": "id pass donot match" })
                    }
                });
            }
        })
    })
});

// route for sending mail on clicking forget password
router.post('/forget', (req, res) => {
    var { email } = req.body;
    var token;

    // using crypto to generate random token 
    crypto.randomBytes(32, (err, buffer) => {
        if (err) { console.log(err); }
        token = buffer.toString('hex');
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

        // query to check user exists or not
        var q1 = "select * from auth where Email = '" + email + "'";
        var milliseconds = (new Date).getTime();
        var tokenExpire = milliseconds.toString();

        // query to update reset_token and token_expire value in database ? reset_token is attached with an email and token_expire for checking the session
        var q2 = "update auth set ResetToken = '" + token + "', TokenExpire = '" + tokenExpire + "' where Email = '" + email + "'";
        request.query(q1, function (err, response) {
            if (err) { res.send(err); }

            // if no user exists it will return else execute another query
            if (response.rowsAffected == 0) { res.send({ "message": "no email exist" }); }
            else {
                request.query(q2, function (err, resp) {
                    if (err) { res.send(err); }
                    else {

                        // using sendgrid for sending email
                        const sgMail = require('@sendgrid/mail');
                        sgMail.setApiKey(config.get('apiKey'));
                        //console.log(config.get('apiKey'));
                        
                        const msg = {
                            to: email,
                            from: 'rishabhsinghalrishabh@gmail.com',
                            subject: 'password reset',
                            text: 'check',
                            html: '<a href="http://localhost:7000/Reset.html?token=' + token + '"><h2>Click here to Reset Password</h2></a>'
                        }
                        if (sgMail.send(msg)) { res.send({ "message": "mail send" }); }
                        else { res.send({ "message": "mail not send" }); }
                    }
                });
            }
        });
    })
})

// route for cheking session 
router.get('/forgetpassword/:token', (req, res) => {
    var check = req.params.token;

    var sql = require('mssql');
    var config = {
        user: 'sa',
        password: 'abcd',
        database: 'auth',
        server: 'DESKTOP-VOMOOC8'
    }
    sql.close();
    sql.connect(config, function (err) {
        if (err) { console.log(err); }
        var request = new sql.Request();

        // query to get token expire by using reset token which is generated while sending email
        var q1 = "select TokenExpire from auth where ResetToken = '" + check + "'";
        request.query(q1, function (err, response) {
            if (err) { res.send({ "message": "error has occured" }) }
            if (response.rowsAffected == 0) { res.send({ "message": "no email" }) }
            else {
                // storing the token_expire value into variable time to compare it with current time for checking session 
                time = response.recordset[0].TokenExpire;

                // using standard epoch time
                var milliseconds = (new Date).getTime();
                parseInt(time, 10);
                parseInt(milliseconds, 10);

                // checking whether session is expired or not, session will expire in 30 min
                var diff = milliseconds - time;
                console.log(diff);
                if (diff > 1800000) {
                    res.send({ "message": "Session Expired" });
                } else {
                    res.send({ "message": "you can change password" });
                }
            }
        });
    })


});

// route for changing password
router.post('/updatepassword', (req, res) => {
    var { newpassword, confirmpassword, token } = req.body;

    // checking if any of the entry is empty
    if (!newpassword || !confirmpassword) {
        res.send({ "message": "fill all entries" });
    }
    else {
        // checking if both password match or not
        if (newpassword != confirmpassword) {
            res.send({ "mesaage": "pasword not match" });
        }
        else {
            // using bcrypt to store password(encoded) in database 
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

                        // query to update password
                        var q1 = "update auth set password = '" + newpassword + "' where ResetToken = '" + token + "'";
                        request.query(q1, function (err, response) {
                            if (err) { res.send(err); }
                            res.send({ "message": "password has been changed" });
                        });
                    })

                });
            });
        }
    }
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

