const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');


module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
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
        var q1 = "select password,role from auth where email = '" + email + "'";
        request.query(q1, function (err, response) {
          if (err) console.log(err);
          pass = response.recordset[0].password;
          bcrypt.compare(password, pass, (err, isMatch) => {
            if (err)
              console.log(err);
            if (isMatch) {
              console.log("success");
              const user = {
                Role: response.recordset[0].role,
                email: email
              }
              jwt.sign({ user }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
                console.log(token);
              });
            } else {
              console.log("unsuccess");
            }
          });
        });
      });
    })
  );
  /*  passport.serializeUser(function(user, done) {
        done(null, user.email);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
      */
}
