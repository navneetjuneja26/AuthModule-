const express = require('express');
const passport = require('passport');
const app = express();

// Passport Config
require('./config/passport')(passport);

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started on port ${PORT}`));