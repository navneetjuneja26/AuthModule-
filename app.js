const express = require('express');
const passport = require('passport');
const app = express();
//var auth = require('./routes/index')(passport);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/users', require('./routes/users'));
app.get('/', (req, res) => {
    res.sendFile('/views/Login.html', { root: __dirname });
})

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started on port ${PORT}`));