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

// mongoose.connect("mongodb://localhost/surfit");
mongoose.connect("mongodb://ujzzkkcofxbbnm7v2g7h:AZctNdYmyxcKbRaJ28BM@bpsupq4wqahgisw-mongodb.services.clever-cloud.com:27017/bpsupq4wqahgisw");
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

// Question.create(
//     {
//         qno: 3,
//         image: 'thank.jpg',
//         answer: ''
//     },function(err,question){
//         if(err){
//             console.log('err');
//         }
//         else{
//             console.log('Question is: '+question);
//         }
//     }
// )

app.get('/',function(req,res){
    if(req.isAuthenticated()){
        res.redirect('/home');
    }
    else{
        res.render('index');
    }
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
    User.register(new User({name: req.body.name, username: req.body.username, qno: 0,start: new Date(), end: new Date(0,0,0,0,0,0,0), college: req.body.college, email: req.body.email}),req.body.password,function(err,user){
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
    Question.find({qno: req.user.qno},function(err,question){
        if(err){
            console.log(err);
        }
        else{
            res.render("main",{question: question[0]});
        }
    });
    // res.render("main");    
});

app.post('/home',function(req,res){
    var given = req.body.answer;
    if(req.user.qno==0){
        User.findByIdAndUpdate(req.user._id,{qno: (req.user.qno + 1),start: new Date()},function(err,updatedUser){
            console.log("Zeroth Question");
            if(err){
                console.log(err);
            }
            else{
                console.log(updatedUser);
                res.redirect('/home');
            }
        });
    }
    else{
    Question.find({qno: req.user.qno},function(err,rquestion){
        if(err){
            console.log(err);
        }
        else{
            // console.log(rquestion[0].answer == given.toLowerCase());
            if(rquestion[0].answer == given.toLowerCase()){
                console.log(req.user.qno);
                if(req.user.qno<11){
                // User.updateOne({_id: req.user._id},{qno: req.user.qno+1});
                    User.findByIdAndUpdate(req.user._id,{qno: (req.user.qno + 1)},function(err,updatedUser){
                        if(err){
                            console.log(err);
                        }
                        else{
                            // console.log(updatedUser.qno);
                        }
                        res.redirect('/home');
                    });
                }
                else{
                    console.log("Done!");
                    User.findByIdAndUpdate(req.user._id,{qno: (req.user.qno + 1), end: new Date()},function(err,updatedUser){
                        if(err){
                            console.log(err);
                        }
                        else{
                            // console.log(updatedUser.qno);
                        }
                        res.redirect('/home');
                    });
                }
            }
            else {
                res.redirect('/home');
            }
        }
    });
}
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

// app.get('/takequiz',(req,res)=>{
//     //res.render(yet to be done,{
//     //    title:
//     //});
// })


// app.post('/takequiz'/* /:id */,(req,res)=>{
//     answer(req,res);
//     if(err){
//         console.log(err);
//     }    
//     else{
//         res.render('/takequiz'/*:id*/);
//     }
// })

// function answer(req,res){
//     if(req.body==Question.find({qno:_id}).answer){
//         Result.update({username:''}, {$inc: {score:1}}); //incomplete here
//         res.redirect('/takequiz'/* :id */);
//     }    
//     else{
//         res.redirect('/takequiz'/* :id */);
//     }
// }

app.get('/leader',isLoggedIn,function(req,res){
    User.find({},function(err,all){
        if(err){
            console.log(err);
        }
        else{
            var i,j;
            for (i = 0; i < all.length-1; i++) {
                for (j=0; j < all.length-i-1 ;j++){
                    if(all[j].qno<all[j+1].qno){
                        var temp = all[j];
                        all[j]=all[j+1];
                        all[j+1]=temp;
                    }
                    else if(all[j].qno==all[j+1].qno){
                        var start1,end1,start2,end2;
                        start1 = all[j].start;
                        start2 = all[j+1].start;
                        end1 = all[j].end;
                        end2 = all[j+1].end;
                        if((end1-start1)>(end2-start2)){
                        var temp = all[j];
                        all[j]=all[j+1];
                        all[j+1]=temp;
                        }
                        else if ((end1-start1)==(end2-start2)) {
                            if(start1>start2){
                                var temp = all[j];
                                all[j]=all[j+1];
                                all[j+1]=temp;
                            }
                        }
                    }
                }
            }
            console.log(all[0].qno);
            res.render("leader",{ppl: all});
        }
    });
});

app.get('/about',isLoggedIn,function(req,res){
    res.render("about");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('login');
}

// app.listen(8080,function(){
//     console.log("Server has Started!");
// });

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has Started!");
});