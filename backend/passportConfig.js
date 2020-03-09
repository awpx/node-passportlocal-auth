const User = require('./model/userSchema');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if(err) throw err;
        //if user not found
        if(!user) return done(null, false);
        //if username found
        bcrypt.compare(password, user.password, (err, result) => {
          if(err) throw err;

          if(result === true) {
            return done(null, user)
          } else {
            return done(null, false);
          }
        })
      })
    })
  );

  //stores cookie inside browser
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  });

  //takes cookie from bowser
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
  
}