const passport = require("passport");
const UserModel = require("../models/database");
const { compareSync } = require("bcrypt");
const facebookStrategy = require("passport-facebook").Strategy;


passport.use(new facebookStrategy({
  clientID: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET",
  callbackURL: "/auth/facebook/callback",
},
function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, profile);
  // UserModel.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  UserModel.findOne({facebookID : profile.id}, (err, user) => {
    if(err) return done(err, null);
    if(!user) {
      let newUser = new UserModel({
        facebookID : profile.id,
        name : profile.displayName
      })
      newUser.save()
      return done(null, newUser);
    }else {
      return done(null, user);
    }
  });
}
));



// //GOOGLE STRATEGY
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: "6477364761-93tdppd5cfbop46f0v3u9tpcuf8mef2m.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:5000/auth/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(accessToken, profile);
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//     UserModel.findOne({googleID : profile.id}, (err, user) => {
//         if(err) return cb(err, null);
//         if(!user) {
//           let newUser = new UserModel({
//             googleID : profile.id,
//             name : profile.displayName
//           })
//           newUser.save()
//           return cb(null, newUser);
//         }else {
//           return cb(null, user);
//         }
//     })
//   }
// ));

  //Persits user data inside session.
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });


  //Fetches Session details using session id.
  passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
  });






