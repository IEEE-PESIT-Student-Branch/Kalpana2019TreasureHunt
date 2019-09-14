var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport =  require('passport');
var bodyParser =  require('body-parser');
var LocalStrategy =  require('passport-local');
var passportLocalMongoose =  require('passport-local-mongoose');

var User = require('./models/user');

mongoose.connect("mongodb://localhost/surfit");
app.use(express.static("css"));
app.use(express.static("js"));
app.use(express.static("assets"));
app.set("view engine","ejs");
app.use(require('express-session')({
    secret: "SurfIt2019$$$",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var questionSchema = new mongoose.Schema({
    image: String,
    question: String,
    answer: String
});
var Question = mongoose.model("Question",questionSchema);

app.get('/',function(req,res){
    res.render('register');
});

app.get('/register',function(req,res){
    res.render("login");
});

app.post('/register',function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            return res.render('login');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/hunt");
        });
    });
});

app.get('/hunt',function(req,res){
    res.render('hunt');
});

app.listen(8080,function(){
    console.log("Server has Started!");
});