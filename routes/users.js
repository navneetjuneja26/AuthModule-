const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');


router.get('/login', (req, res) => res.render('login'));

router.get('/forgetpassword', (req, res) => res.render('forget_password'));

// setting new password
router.post('/forgetpassword', (req, res) => {

    var { newpassword, confirmpassword, email } = req.body;
    let err = [];
    /*var sql = require('mssql');
          var config = {
              user: 'sa',
              password: 'abcd',
              database: 'auth',
              server: 'DESKTOP-VOMOOC8'
          }
    sql.connect(config, function(err){
        if(err) console.log(err);
         var request = new sql.Request();
         var q1 = "select TokenExpire from auth where Email = '"+ email +"'";
         console.log(q1);
         request.query(q1, function(err, response){
            if(err) console.log(err);
            time = response.recordset[0].TokenExpire;
            parseInt(pass, 10);
            if(time>(time + 1800000)){
                res.send("session expire");
            }
         });
    });*/



    if (!newpassword || !confirmpassword){
        //console.log("fill all entries");
        res.send({"message" : "fill all entries"});
    }
    if (newpassword != confirmpassword) {
        res.send("pasword not match");
    }
    if (err.length > 0) {
        res.render('forget_password', {
            newpassword,
            confirmpassword
        });
    }else{
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newpassword, salt, (err, hash) => {
              if (err) throw err;
              //console.log(hash);
              //console.log(newpassword);
              newpassword = hash;
              //console.log(newpassword);
              // qury to store;
              
              var sql = require('mssql');
              const pool = new sql.ConnectionPool({
                user: 'sa',
                password: 'abcd',
                server: 'DESKTOP-VOMOOC8',
                database: 'auth'
            })

              var conn = pool;
              //console.log(config);
              conn.connect().then(function(err){
                  if(err) console.log(err);
                   var request = new sql.Request(conn);
                   var q1 = "update auth set password = '"+ newpassword + "'where email = '"+ email + "'";
                   //console.log(q1);
                   request.query(q1, function(err, res){
                      if(err) res.send(err);
                      res.send("password updated");
                   });
              })

            });
        });
    }    
});

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successMessage: res.send("done")
    })(req, res, next)
    //res.send("djkfh");
});

// mail send on forget password
router.post('/forget/:email', (req, res) => {
    
    crypto.randomBytes(32, (err, buffer) => {
        if(err) { console.log(err); res.send( {"err" : "cannot generate"} ); }
        const token = buffer.toString('hex');
        var sql = require('mssql');
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'abcd',
            server: 'DESKTOP-VOMOOC8',
            database: 'auth'
        });
        var conn = pool;
        //console.log(config);
        conn.connect().then(function(err){
            if(err) console.log(err);
            var request = new sql.Request(conn);
            var q1 = "select * from auth where Email = '"+ req.params.email +"'";
            var milliseconds = (new Date).getTime();
            var tokenExpire = milliseconds.toString();
            var q2 = "update auth set ResetToken = '"+ token +"', TokenExpire = '"+ tokenExpire +"' where Email = '"+ req.params.email +"'";
            request.query(q1, function(err, response){
                if(err) {res.send(err);}
                if(response.rowsAffected == 0) { res.send("response"); }
                request.query(q2, function(err, resp){
                    if(err) {res.send(err);}
                    else{ console.log("updated");
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey('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');
                    const msg = {
                        to: req.params.email,
                        from: 'rishabhsinghalrishabh@gmail.com',
                        subject: 'password reset',
                        text: 'check',
                        html: `<a href="http://localhost:7000/Reset.html">http://localhost:7000/reset.html </a>`
                    }
                    sgMail.send(msg);
                    res.send("mail send");
                    console.log('done'); }
                });
            });
        })
    });


    /*const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
        to: req.params.email,
        from: 'rishabhsinghalrishabh@gmail.com',
        subject: 'check',
        text: 'check',
        html: '<h1>done</h1>'
    }
    sgMail.send(msg);
    res.send("mail send");
    console.log('done');*/
})

router.post('/signup', (req, res) => {

    var{ email, password, role } = req.body;
    console.log(password);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          password = hash;
          // qury to store;

          var sql = require('mssql');
          var config = {
              user: 'sa',
              password: 'abcd',
              database: 'auth',
              server: 'DESKTOP-VOMOOC8'
          }

          sql.connect(config, function(err){
            if(err) console.log(err);
             var request = new sql.Request();
             var q1 = "insert into auth (Email, Password, Role) values('"+ email + "','" +  password + "','"+ role +"')";
             console.log(q1);
             request.query(q1, function(err, response){
                if(err) console.log(err);
                res.send(response);
             });
        });  
        });
    });
})



module.exports = router;

