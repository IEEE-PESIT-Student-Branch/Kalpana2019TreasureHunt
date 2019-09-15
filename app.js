var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport =  require('passport');
var bodyParser =  require('body-parser');
var LocalStrategy =  require('passport-local');
var passportLocalMongoose =  require('passport-local-mongoose');

var User = require('./models/user');
var Result = require('./models/result');
var Question = require('./models/question');

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
    User.register(new User({name: req.body.name, username: req.body.username, college: req.body.college, email: req.body.email}),req.body.password,function(err,user){
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

(err, user, info) => {
    console.log('ERR: ', err); // returns null
    console.log('USER: ', user); // returns false
    console.log('INFO: ', info);}

app.post('/login',passport.authenticate('local',{
    successRedirect: "/home",
    failureRedirect: "/login"
}),function(req,res){
    console.log("POSTED");
    // res.redirect('/login');
    //answer();
    //let result = new Result({
    //    username: req.body.name,
    //    score: 0  
    //})
});

app.get('/home',isLoggedIn,function(req,res){
    res.render("main");    
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

app.get('/takequiz',(req,res)=>{
    //res.render(yet to be done,{
    //    title:
    //});
})


app.post('/takequiz'/* /:id */,(req,res)=>{
    answer(req,res);
    if(err){
        console.log(err);
    }    
    else{
        res.render('/takequiz'/*:id*/);
    }
})

function answer(req,res){
    if(req.body==Question.find({qno:_id}).answer){
        Result.update({username:''}, {$inc: {score:1}}); //incomplete here
        res.redirect('/takequiz'/* :id */);
    }    
    else{
        res.redirect('/takequiz'/* :id */);
    }
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('login');
}

app.listen(8080,function(){
    console.log("Server has Started!");
});

