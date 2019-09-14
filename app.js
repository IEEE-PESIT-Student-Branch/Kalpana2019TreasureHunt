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
passport.use(new LocalStrategy(User.authenticate()));
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
    res.render('index');
});

app.get('/register',function(req,res){
    res.render("register");
});

app.post('/register',function(req,res){
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.username);
    console.log(req.body.college);
    User.register(new User({name: req.body.name, email: req.body.email, username: req.body.username, college: req.body.college}),req.body.password,function(err,user){
        if(err){
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/login");
        });
    });
});

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',passport.authenticate("local"),{
    successRedirect: "/home",
    failureRedirect: "/login"
},function(req,res){
    res.render('login');
});

app.listen(8080,function(){
    console.log("Server has Started!");
});