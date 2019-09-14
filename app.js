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
    // name: req.body.name, 
    // , username: req.body.username, college: req.body.college
    User.register(new User({email: req.body.email}),req.body.password,function(err,user){
        if(err){
            console.log("Error: "+err);
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

// (err, user, info) => {
//     console.log('ERR: ', err); // returns null
//     console.log('USER: ', user); // returns false
//     console.log('INFO: ', info);}

app.post('/login',passport.authenticate("local",passport.authenticate('local',{
    successRedirect: "/home",
    failureRedirect: "/login"
}),),function(req,res){
    console.log("POSTED");
    res.redirect('/login');
});

app.get('/home',isLoggedIn,function(req,res){
    res.render("home");    
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('login');
}

app.listen(8080,function(){
    console.log("Server has Started!");
});