const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const User = require('./model/userSchema')

const app = express();



//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('db connected...')
);

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'secretcode',
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser('secretcode'));

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);
//---------End of middleware----------------

//Routes
//register new user
app.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if(err) throw err;
    if(doc) res.send('user alrady exist')
    if(!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword
      });
      await newUser.save()
      req.send('user created');
    }
  })
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err,user, info) => {
    if(err) throw err;
    if(!user) res.send('user not exist');
    else {
      req.logIn(user, (err) => {
        if(err) throw err;
        res.send('Success Authenticated');
        console.log(req.user)
      })
    }
  }) (req, res, next);
});

app.get('/user', (req, res) => { 
  res.send(req.user)
 });

//start server
app.listen(4000, () => {
  console.log('Server running...')
})