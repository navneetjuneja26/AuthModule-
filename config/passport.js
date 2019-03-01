const LocalStrategy = require('passport-local').Strategy;
// sql server
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const express =require('express');

// model of table

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          // Match user 
          var sql = require('mssql');
          const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'abcd',
            server: 'DESKTOP-VOMOOC8',
            database: 'auth'
        })
             var conn = pool;
              //var check = 'check';
              conn.connect().then( function(err){ 
                  
                  if(err) console.log(err);
                   var request = new sql.Request(conn);
                   var q1 = "select password from auth where email = '"+ email+"'";
                   //console.log(q1);
                   request.query(q1, function(err, response){
                       //console.log("Response : ",response);
                      if(err) console.log(err);
                      //console.log(response);
                      pass = response.recordset[0].password;
                      //check = pass;
                      bcrypt.compare(password, pass, (err, isMatch) => {
                        if(err) 
                        console.log(err);
                        if(isMatch){
                            console.log("success");
                            const user={
                                User_Name:'ankit',
                                email:'ankit@gmail.com'
                            }
                            jwt.sign({user},'secretkey',{expiresIn:'1d'},(err,token)=>{
                                console.log(token);
                            });
                        } else{
                            console.log("un success");
                        }
                      });
                   });
              });
            //console.log(check); 
        })
      );
    passport.serializeUser(function(user, done) {
        done(null, user.email);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}
