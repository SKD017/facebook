const express = require("express");
const app = express();
const UserModel = require("./models/database");
const ejs = require("ejs");
const { hashSync } = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//PORT
const port = 5000;


app.set('view engine', 'ejs', );
app.use(express.urlencoded({ extended : true }))


app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // store: MongoStore.create({ mongoUrl : 'mongodb://127.0.0.1:27017/passport',  collectionName : "sessions"}),
    store: MongoStore.create({ mongoUrl : 'mongodb://127.0.0.1:27017/passport-facebook',  collectionName : "sessions"}),
    cookie: { 
      maxAge : 1000 * 60 * 60 * 24,
     }
  }))

const passport = require("passport");
require("./config/passport");
  app.use(passport.initialize());
  app.use(passport.session());

app.get("/login",(req, res) => {
    res.render("login");
})



app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });




app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

app.get("/protected", (req, res) => {
    if(req.isAuthenticated()) {
        // res.send("Protected");
        res.render("protected", {
            name : req.user.name,
        });
    }else {
        res.status(401).send({ message : "User UnAuthorised" })
    }
    console.log(req.session);
    console.log(req.user)
    // res.send("Protected");
})

app.listen(port, () => {
    console.log(`Server is Running on the Port http://localhost:${port}`);
})
